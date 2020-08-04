import React from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';

export default function () {
	return (
		<div style={{ display: 'block', width: '100%', alignItems: 'left', margin: '20px' }}>
			<div className="subject-font">
				{reactLocalStorage.get('email')
					? '로그인 이메일 : ' + reactLocalStorage.get('email')
					: '로그인이 필요합니다.'}
			</div>
			<hr />
		</div>
	);
}