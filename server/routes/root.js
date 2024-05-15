const express = require('express')
const router = express.Router()
const path = require('path')

// ^ is for beggining of string , $ is for end , this mean is path is only a slash 
// or /index or /index.html , optional chaining 
router.get('^/$|/index?(.html)' , (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

module.exports = router 
