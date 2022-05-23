const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    passwd: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        dafault: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
    
})

const User = mongoose.model('User', userSchema)

module.exports = { User }