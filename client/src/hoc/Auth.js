import React, { useEffect } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import axios from 'axios';

export default function (SpecialComponent) {
	function AuthCheck(props) {
		useEffect(() => {
			axios.get('/api/users/auth').then((response) => {
				console.log('RESPONSE : ', response);
				if (response.data.isAuth) {
					return (<SpecialComponent />)
				} else {
					alert('세션이 만료되었습니다. 다시 로그인 해주세요.');
					reactLocalStorage.clear();
					props.history.push('/login')
				}
			});
		}, [])
		return (<SpecialComponent />)
	}

	return AuthCheck
}