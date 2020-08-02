// ==== sockey setting for chatting ====
const express = require('express');
const app = express();
const chatServer = require('http').Server(app)
const io = require('socket.io')(chatServer)

chatServer.listen(4001, () => {
	console.log("Start Chatting Server...."); 
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('message', (msg) => {
    io.emit('mes', msg);
  });
  socket.on('disconnect', () => {
  console.log('user disconnected');
  });
});