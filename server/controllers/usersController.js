const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users 
// @route GET /users
// @access PRIVATE 
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({message: 'No users found'})
    }
    res.json(users)
})

// @desc Create a user 
// @route POST /users
// @access PRIVATE 
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body 
    // Confirm data
    if (!username || !password || !Array.isArray(roles)){
        return res.status(400).json({message: 'All fields required'}) 
    }

    // Check for duplicate 
    const duplicate = await User.findOne({ username }).lean().exec()
    if (duplicate) {
        return res.status(409).json({message: 'Duplicate username'})
    }
    
    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10)
    const newUserObject = { username, "password": hashedPwd, roles}

    // Create and store new user
    const user = await User.create(newUserObject)

    if(user) { // created 
        res.status(201).json({message: `New User ${username} created!`})
    }else {
        res.status(201).json({message: 'Invalid user data recieved' })
    }
})

// @desc Update a user 
// @route PATCH /users
// @access PRIVATE 
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, password, roles, active } = req.body 
    // Confirm data
    if (!id|| !username || !Array.isArray(roles) || typeof active !== 'boolean'){
        return res.status(400).json({message: 'All feilds required'}) 
    }
    const user = await User.findById(id).exec()

    if(!user) {
        return res.status(400).json({message: 'User not Found'})
    }

    // Check for duplicate 
    const duplicate = await User.findOne({ username }).lean().exec()
    // Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({message: 'Duplicate username'})
    }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        // Hash password
        user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save()
    res.json({ message: `${updatedUser.username} updated`})

})

// @desc Delete a user 
// @route DELETE /users
// @access PRIVATE 
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body 

    if (!id) {
        return res.status(400).json({message: 'User ID required'})
    }
    const user = await User.findById(id).exec()
    if(!user) {
        return res.status(400).json({message: 'User not found'})
    }
    const result = await user.deleteOne()
    const reply = `User: ${user.username} with ID ${user._id} deleted!`
    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}