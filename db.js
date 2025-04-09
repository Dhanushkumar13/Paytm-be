const mongoose = require('mongoose');
const { Schema } = require('zod');

mongoose.connect('mongodb+srv://dhanushpappu99:dhanush123@zomatoclonebe.vligrcj.mongodb.net/paytm-be');

const userSchema =new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minLength: 5
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    }
})

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const userModel = mongoose.model('User',userSchema);
const accountModel = mongoose.model('Account',accountSchema);

module.exports = {accountModel,userModel};