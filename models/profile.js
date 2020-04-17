let mongoose = require('mongoose');

let profileSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId, 
        ref: 'User'     // Ref to User
    },
    dept: {
        type: String,
        required: true
    },
    salary:{
        type: String,
        required: true
    }
});

let Profile = module.exports = mongoose.model('Profile', profileSchema, 'profile');