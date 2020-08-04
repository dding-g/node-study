const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')

const chatSchema = mongoose.Schema({
	email : {
        type : String,
		maxlength : 50,
    },
	to : String,// to who. email or all
	msg : String,
	datetime : { type: Date, default: Date.now },
});



const Chat = mongoose.model('Chat', chatSchema);
module.exports = {Chat};