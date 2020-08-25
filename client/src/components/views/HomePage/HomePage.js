import React from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import { withRouter } from 'react-router-dom';
import LoginBanner from '../../banners/LoginBanner/LoginBanner';

function HomePage(props) {
	const onFileManageHandler = (event) => {
		props.history.push('/file');
	};

	const onChatHandler = (event) => {
		props.history.push('/chat');
	};

	return (
		<div>
			<LoginBanner />
			<div className="home-body">
				<div className="container">
					<div>
						<p className="subject-font">
							환영합니다. {reactLocalStorage.get('email')} 님!
						</p>
					</div>
					<div className="row home-btn-col">
						<div className="col-sm">
							<button
								className="btn btn-info"
								style={{ width: '100%', height: '100%' }}
								onClick={onFileManageHandler}
							>
								파일 매니저
							</button>
						</div>

						<div className="col-sm">
							<button
								className="btn btn-warning"
								style={{ width: '100%', height: '100%' }}
								onClick={onChatHandler}
							>
								채팅
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default withRouter(HomePage);