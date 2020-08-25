import React, { useState } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import axios from 'axios';
import LoginBanner from '../../banners/LoginBanner/LoginBanner';


function LoginPage(props) {
	const [Email, setEmail] = useState('');
	const [Password, setPassword] = useState('');

	const onEmailHandler = (event) => {
		setEmail(event.currentTarget.value);
	};

	const onPasswordHandler = (event) => {
		setPassword(event.currentTarget.value);
	};

	const onSubmitHandler = (event) => {
		event.preventDefault(); //이걸 해주면 로그인을 눌러도 refresh가 안됨

		let body = {
			email: Email,
			password: Password,
		};

		axios.post('/api/users/login', body).then((response) => {
			if (!response.data.loginSuccess) alert(response.data.message);
			else {
				alert('로그인 성공');
				reactLocalStorage.set('email', response.data.email);
				props.history.push('/');
			}
		});
	};

	return (
		<div>
			<LoginBanner />
			<div className="text-center">
				<form className="form-signin" onSubmit={onSubmitHandler}>
					<h1 className="h3 mb-3 font-weight-normal">로그인</h1>

					<input
						type="email"
						id="inputEmail"
						className="form-control"
						placeholder="이메일"
						value={Email}
						onChange={onEmailHandler}
						autoFocus
					/>
					<input
						type="password"
						id="inputPassword"
						className="form-control"
						placeholder="비밀번호"
						value={Password}
						onChange={onPasswordHandler}
					/>

					<a href="/register">회원가입</a>

					<button
						className="btn btn-lg btn-primary btn-block"
						id="btn-login"
						type="submit"
					>
						로그인
					</button>
				</form>
			</div>
		</div>
	);
}

export default LoginPage;