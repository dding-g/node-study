const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')

const chatSchema = mongoose.Schema({
	email : {
        type : String,
        maxlength : 50,
        unique : 1
    },
	target : String, //누구에게 보낼것인가. email or all
	message : String,
	datetime : Date.now
});