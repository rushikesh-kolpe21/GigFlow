const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define User Schema
const UserSchema = new Schema({ 
       firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true, 
    },

}, {timestamps: true});

// Create User model
const UserModel = mongoose.model('Users', UserSchema);

module.exports = UserModel;