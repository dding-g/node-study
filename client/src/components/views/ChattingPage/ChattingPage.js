import React from 'react';
import { ReactDOM, withRouter } from 'react-router-dom';
import socketio from 'socket.io-client';

function ChattingPage(props) {
	const socket = socketio.connect('https://area409.run.goorm.io:53528');
	
	(() => {
		socket.emit('message', { name: 'bella' });

		socket.on('welcome', (msg) => {
			console.log(msg);
		});
	})();
	return <div></div>;
}

export default withRouter(ChattingPage);