import React, { useState } from 'react';
import axios from 'axios';
import {reactLocalStorage} from 'reactjs-localstorage'
import { withRouter } from 'react-router-dom';
import LoginBanner from '../../banners/LoginBanner/LoginBanner'

function HomePage(props) {
	const [Email, setEmail] = useState(reactLocalStorage.get('email'));
	
	const onFileManageHandler = (event) => {
		props.history.push('/file-manage')
	};
	
	const onChatHandler = (event) => {
		props.history.push('/chat')
	};
	
	const onLogoutHandler = (event) => {
		event.preventDefault();
		
		axios.get('/api/users/logout')
		.then(response => {
			console.log(response.data)
			if(!response.data.success){
				console.log(response.data.err);
				alert('로그아웃 실패')
			}else{
				props.history.push('/login')
				reactLocalStorage.clear();
				alert('로그아웃 성공')
			}
		});
	};

	return (
		<div className='full-page'>
			<LoginBanner />
		<div className='home-body'>
			<div className="container">
				<div><p className='subject-font'>환영합니다. {Email} 님!</p></div>
				<div className="row home-btn-col">
					<div className="col-sm">
						<button className="btn btn-info" style={{ width: '100%', height: '100%' }} onClick={onFileManageHandler}>
							파일 매니저
						</button>
					</div>

					<div className="col-sm">
						<button className="btn btn-warning" style={{ width: '100%', height: '100%' }} onClick={onChatHandler}>
							채팅
						</button>
					</div>
					
					<div className="col-sm">
						<button className="btn btn-dark" style={{ width: '100%', height: '100%' }} onClick={onLogoutHandler}>
							로그아웃
						</button>
					</div>
				</div>
			</div>
		</div>
		</div>
	);
}

export default withRouter(HomePage);