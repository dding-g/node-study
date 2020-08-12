// ==== sockey setting for chatting ====
const express = require('express');
const app = express();
const chatServer = require('http').createServer(app);
const io = require('socket.io')(chatServer);
const mongoose = require('mongoose');
const { User } = require('../model/User');
const { Chat } = require('../model/Chat');
const config = require('../config/key');

mongoose
	.connect(config.mongoURI, {
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.then(() => console.log('MongoDB Connected on Chat Server'))
	.catch((err) => console.log(err));


io.on('connection', (socket) => {
	console.log('a user connected', socket.handshake.query.email);
	
	if(socket.handshake.query.email){
		User.updateOne({email:socket.handshake.query.email}, {$set : {socketid:socket.id}}, (err, data) => {
			if(err) console.log("SOCKET ID UPDATE FAIL : ", err)
		});	
	}
	
	socket.on('wispSckIDreq', (msg) => {
		User.findOne({email:msg.email}, (err, data) => {
			io.to(socket.id).emit('wispSckIDreq', {socketid : data.socketid, email:msg.email})
		})
	});
	
	socket.on('wispher', (msg) => { // wispher
		let body = {
			email : msg.email,
			to : msg.toEmail,
			msg : msg.msg
		};
		const chatInfo = new Chat(body);
		chatInfo.save((err) => {
			if(err) console.log("ERROR SAVE WISPHER CHAT : ", err)
			else io.to(msg.socketid).emit('wispher', msg);
		})
	});
	
	socket.on('message', (msg) => { //전체 채팅
		console.log(msg)
		let body = {
			email : msg.email,
			to : 'all',
			msg : msg.msg
		};
		const chatInfo = new Chat(body);
		chatInfo.save((err) => {
			if(err) console.log("ERROR SAVE ALL CHAT : " , err);
			else io.emit('serverTOclient', body);
		});
	});
	
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

chatServer.listen(4001, () => {
	console.log('Start Chatting Server....');
});