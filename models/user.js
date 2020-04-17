let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.ObjectId
    },
    userName: {
        type: String,
        required: true,
        index: {unique: true}
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    }
});

let User = module.exports = mongoose.model('User', userSchema, 'user');