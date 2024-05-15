const mongoose = require('mongoose')

const noteScehma = new mongoose.Schema(
    {
        user: {
            type: mongoose.SchemaTypes.ObjectId, // object id of a USER
            required: true,
            ref: User
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Note', noteScehma)