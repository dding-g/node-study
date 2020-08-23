import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import socketio from 'socket.io-client';
import { reactLocalStorage } from 'reactjs-localstorage';
import { ChatFeed, Message } from 'react-chat-ui';
import axios from 'axios';

const socketClient = socketio('http://13.209.84.7:50603', {
	query: 'email=' + reactLocalStorage.get('email'),
});

/*
	귓속말 모드
		1. 귓속말을 보낼 상대의 socketid 를 server에 request (parameter : email)
		2. server에서 DB에 저장된 socketid를 email로 조회한 후 client에 socketid 반환. 
		   io.to(socketid).emit 으로 req를 보낸 client에게만 전달 (paramter : socketid)
		3. client에서 socketid 를 받아 귓속말할 생대에게 io.to(socketid).emit 으로 message 전달
		4. server에서 message를 받아 저장. 이때 to를 email로 저장
*/

function ChattingPage(props) {
	// 전체 채팅 기록 보관
	const [Chat, SetChat] = useState([]);
	const [Msg, SetMsg] = useState(''); // 보낼 message 보관
	const [Wisp, SetWisp] = useState(false); // 귓속말 모드 : true, 전체 채팅 모드 : false
	const [WispTargetEmail, SetWispTargetEmail] = useState(''); // display할 email
	const [WispTargetSckID, SetWispTargetSckID] = useState(''); // 귓속말을 보낼 socket id

	useEffect(() => {
		if (Chat.length === 0) {
			axios
				.get('/api/chat/init-msg')
				.then((response) => {
					var init = [];
					response.data.data.forEach(async (items) => {
						/*
							1. items.to 와 나의 email이 같으면 나에게 온 귓속말
							2. items.to 와 나의 email이 다르고
								1. item.email 과 나의 email이 같으면 내가 보낸 귓속말
							3. 나머지는 전체 채팅
						*/

						var chatEmailRenderText = '';
						if (items.to !== 'all') {
							if (items.to === reactLocalStorage.get('email'))
								chatEmailRenderText = items.email + ' 에게 온 귓속말';
							else if (items.email === reactLocalStorage.get('email'))
								chatEmailRenderText = items.to + ' 에게 보낸 귓속말';
						} else {
							chatEmailRenderText = items.email; // 전체 체팅
						}

						await init.push(
							new Message({
								id: 1,
								message: chatEmailRenderText,
							}), // Email
							new Message({ id: 0, message: items.msg })
						);
					});
					return init;
				})
				.then((response) => {
					console.log(response);
					SetChat(response);
				});
		}
	}, [Chat]);

	const setMsgFn = async function (receive) {
		await SetChat(
			Chat.concat([
				new Message({
					id: 1,
					message: receive.email,
				}), // Email
				new Message({ id: 0, message: receive.msg }),
			])
		);
	};

	useEffect(() => {
		const scrollForm = document.getElementById('message-form');
		scrollForm.scrollTop = scrollForm.scrollHeight;
	});

	useEffect(() => {
		// 받은 메세지를 Message Component에 Set
		socketClient.on('serverTOclient', (receive) => {
			setMsgFn(receive);
		});

		//귓속말 모드 설정
		socketClient.on('wispSckIDreq', (receive) => {
			if (receive.socketid) {
				SetWispTargetEmail(receive.email);
				SetWispTargetSckID(receive.socketid);
				SetWisp(true);
			}
		});

		// 귓속말 받았을때
		socketClient.on('wispher', (receive) => {
			let body = {
				email: receive.email + ' 에게 온 귓속말',
				msg: receive.msg,
			};
			setMsgFn(body);
		});
	});

	const onChangeMsgHandler = (event) => {
		event.preventDefault();
		SetMsg(document.getElementById('message').value);
	};
	const onSendBtnHandler = (event) => {
		event.preventDefault();

		if (Msg.substr(0, 4) === '/all') {
			// 전체 채팅 모드
			SetWispTargetSckID('');
			SetWisp(false);
		} else if (Msg.substr(0, 3) === '/r ') {
			// 귓속말 모드
			socketClient.emit('wispSckIDreq', {
				email: Msg.substr(3, Msg.length),
			});
		} else if (Wisp) {
			// 귓속말 보내기
			let body = {
				email: reactLocalStorage.get('email'),
				toEmail: WispTargetEmail,
				socketid: WispTargetSckID,
				msg: Msg,
			};

			socketClient.emit('wispher', body);

			body.email = WispTargetEmail + ' 에게 보낸 귓속말';
			setMsgFn(body);
		} else {
			//전체 모드일때 메세지 전송
			socketClient.emit('message', {
				email: reactLocalStorage.get('email'),
				msg: Msg,
			});
			console.log('CHAT : ', Chat);
		}
	};

	return (
		<div className="chat-page-body">
			<div className="chat-body">
				<p className="subject-font">채팅</p>
				<hr />
				<p className="subject-font">
					{Wisp ? WispTargetEmail + ' 에게 귓속말' : '전체 채팅 모드'}
				</p>
				<hr />
				<p className="subject-font">
					귓속말 모드 전환 : /r test@example.com <br />
					전체 모드 전환 : /all
				</p>
				<hr />
				<div className="row" style={{ height: '70%' }}>
					<div id="message-form" className="message-form">
						<div id="msg-body">
							<ChatFeed
								messages={Chat} // Boolean: list of message objects
								isTyping={false} // Boolean: is the recipient typing
								hasInputField={false} // Boolean: use our input, or use your own
								showSenderName // show the name of the user who sent the message
								bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
								// JSON: Custom bubble styles
								bubbleStyles={{
									text: {
										fontSize: 15,
										color: '#FFFFFF',
									},
									chatbubble: {
										borderRadius: 30,
										padding: 15,
									},
								}}
							/>
						</div>
					</div>
				</div>
				<div className="row" style={{ height: '10%' }}>
					<div className="col-8 chat-box">
						<textarea
							id="message"
							onChange={onChangeMsgHandler}
							className="text-area-form"
						></textarea>
					</div>
					<div className="col-4 chat-box">
						<div className="send-btn-form">
							<button className="btn btn-success" onClick={onSendBtnHandler}>
								전송
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default withRouter(ChattingPage);