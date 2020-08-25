import React, { useState } from 'react';
import axios from 'axios';
import LoginBanner from '../../banners/LoginBanner/LoginBanner';

function RegisterPage(props) {
	const [Email, setEmail] = useState('');
	const [CheckEmail, setCheckEmail] = useState(false);
	const [Password, setPassword] = useState('');
	const [CheckPassword, setCheckPassword] = useState('false');
	const [PasswordCheckText, setPasswordCheckText] = useState('');

	const onEmailHandler = (event) => {
		setEmail(event.currentTarget.value);
	};

	const onPasswordHandler = (event) => {
		setPassword(event.currentTarget.value);
	};

	const onCheckPasswordHandler = (event) => {
		if (Password === document.getElementById('inputPasswordCheck').value) {
			setPasswordCheckText('비밀번호가 같습니다.');
			setCheckPassword(true);
		} else {
			setPasswordCheckText('비밀번호가 다릅니다.');
			setCheckPassword(false);
		}
	};

	const onRegisterHandler = (event) => {
		event.preventDefault();

		if (!CheckEmail) {
			alert('이메일을 체크해주세요');
			return;
		}
		if (!CheckPassword) {
			alert('비밀번호를 확인해주세요');
			return;
		}

		let body = {
			email: Email,
			password: Password,
		};

		axios.post('/api/users/register', body).then((response) => {
			if (response.data.success === true) {
				alert('회원가입에 성공하였습니다! 다시 로그인 해주세요.');
				props.history.push('/login');
			}
		});
	};

	const emailValid = (event) => {
		let body = {
			email: Email,
		};

		axios.post('/api/users/register/emailValid', body).then((response) => {
			console.log(response);
			if (response.data.success === false) {
				console.log(response);
				alert('이메일 체크에 실패했습니다. 다시한번 시도해 주세요');
			} else if (response.data.emailExist === true) {
				alert('이미 존재하는 이메일 입니다.');
			} else if (response.data.emailExist === false) {
				alert('사용 가능한 이메일 입니다.');
				setCheckEmail(true);
			}
		});
	};

	return (
		<div>
			<LoginBanner />
			<div className="text-center sing-in-body">
				<form className="form-signin" onSubmit={onRegisterHandler}>
					<h1 className="h3 mb-3 font-weight-normal">회원가입</h1>

					<div style={{ display: 'flex', flexDirection: 'row' }}>
						<input
							type="email"
							id="inputEmail"
							className="form-control"
							placeholder="이메일"
							value={Email}
							onChange={onEmailHandler}
							autoFocus
						/>
						<button
							className="btn btn-default check-btn"
							type="button"
							onClick={emailValid}
						>
							Check
						</button>
					</div>

					<input
						type="password"
						id="inputPassword"
						className="form-control"
						placeholder="비밀번호"
						value={Password}
						onChange={onPasswordHandler}
					/>

					<input
						type="password"
						id="inputPasswordCheck"
						className="form-control"
						placeholder="비밀번호 확인"
						onChange={onCheckPasswordHandler}
					/>
					<div class="left-text" id="passwordCheckText">
						{PasswordCheckText}
					</div>

					<a href="login">로그인</a>

					<button className="btn btn-lg btn-primary btn-block" type="submit">
						회원가입 하기
					</button>
				</form>
			</div>
		</div>
	);
}

export default RegisterPage;