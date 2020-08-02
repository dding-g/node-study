import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';

function PostViewPage(props) {
	console.log("POSTVIEW : ", props)
	const onPostEditBtnHandler = (event) => {
		return props.history.push({
			pathname: '/post/edit',
			state: {
				title: props.location.state.title,
				post: props.location.state.post,
				path: props.location.state.path
			},
		});
	};

	const onCancleBtnHandler = (event) => {
		return props.history.goBack();
	};

	return (
		<div className="post-body">
			<form>
				<div>
					<p className='subject-font'>파일명</p>
					<hr/>
					<p id="title">{props.location.state.title}</p>
					<hr/>
				</div>

				<div>
					<p className='subject-font'>내용</p>
					<hr/>
					<p id="post">{props.location.state.post}</p>
					<hr/>
				</div>

				<div>
					<button
						type='button'
						className="btn btn-primary"
						onClick={onPostEditBtnHandler}
					>수정</button>
					<button
						type='button'
						className="btn btn-secondary"
						onClick={onCancleBtnHandler}
					>취소</button>
				</div>
			</form>
		</div>
	);
}

export default withRouter(PostViewPage);