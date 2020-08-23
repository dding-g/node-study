import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import axios from 'axios';
import { reactLocalStorage } from 'reactjs-localstorage';

export default withRouter(function (props) {
	const [Email, SetEmail] = useState(reactLocalStorage.get('email'));

	const logoutHandler = () => {
		axios.get('/api/users/logout').then((response) => {
			if (!response.data.success) {
				alert('로그아웃 실패');
			} else {
				reactLocalStorage.clear();
				SetEmail(null);
				alert('로그아웃 성공');
				props.history.push('/login');
			}
		});
	};

	const loginContents = '로그인 이메일 : ' + Email;

	const logoutBtn = (
		<button className="btn btn-secondary" onClick={logoutHandler}>
			로그아웃
		</button>
	);

	return (
		<Navbar bg="dark" variant="dark">
			<Navbar.Brand href="/">ddingg</Navbar.Brand>
			<Nav className="mr-auto">
				<Nav style={{color:'white', margin:"10px"}}>{Email ? loginContents : '로그인이 필요합니다.'}</Nav>
				<Nav>{Email ? logoutBtn : ''}</Nav>
			</Nav>
		</Navbar>
	);
});