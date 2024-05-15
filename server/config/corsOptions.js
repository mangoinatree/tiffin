const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) { // !origin for things things like postman 
            callback(null, true) // null because we dont have an error
        }else {
            callback(new Error('Not allowed by CORS'))
        } 
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions 