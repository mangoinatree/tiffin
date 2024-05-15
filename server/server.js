require('dotenv').config() // global requirement
const express = require('express')
const app = express()
const path = require('path')
const { logger , logEvents} = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500 

connectDB()

// want to log everything so it comes before all the paths 
app.use(logger)

// makes API available to passed orgins 
app.use(cors(corsOptions))

// lets app accept and parse json data 
app.use(express.json())

//Third party middleware 
app.use(cookieParser())

// tells app where to look for static files , built in middleware 
app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/' , require('./routes/root'))

app.use('/users', require('./routes/userRoutes'))

// We want to put the 404 after all the other routes 
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname,'views', '404.html' ))
    } else if (req.accepts('json')) {
        res.json({'message': '404 Not Found'})
    } else {
        res.type('txt').send('404 Not Found')
    }
})

// Use after everything, to catch any errors 
app.use(errorHandler)


mongoose.connection.once('open', () => {
    console.log('Connnected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog')
})

