const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength : 30
    },
    email : {
        type : String,
        maxlength : 50,
        unique : 1
    },
    password : {
        type : String,
        minlength : 5,
        maxlength : 50
    },
    lastname : {
        type : String,
        maxlength : 50
    },
    role : {
        type : Number,
        default : 0
    },
    image : String,
    token : {
        tyep : String
    },
    tokenExp : {
        type : Number
    }
});

const User = mongoose.model('User', userSchema);
module.exports = {User};