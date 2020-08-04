import axios from 'axios';
import { ChatFeed, Message } from 'react-chat-ui';
import { withRouter } from 'react-router-dom';
import React from 'react'

export default withRouter(function (ChatComponent) {
	function initMsg(props) {
		
		var init = [];
		
		axios
			.get('/api/chat/init-msg')
			.then(function (response) {
				

				response.data.data.forEach(async (items) => {
					await init.push([
						new Message({
							id: 1,
							message: items.email,
						}), // Email
						new Message({ id: 0, message: items.msg }),
					]);
				});

// 				props.history.push(ChatComponent, {
// 					data:initMsg,
// 				});
			})
			

		return (ChatComponent, init);
	}

	return initMsg;
})