const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://dhanushpappu99:dhanush123@zomatoclonebe.vligrcj.mongodb.net/paytm-be');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 20,
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

const userModel = mongoose.model('User',userSchema);

module.exports = userModel;