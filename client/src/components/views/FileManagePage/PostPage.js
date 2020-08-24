import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import PostContainer from './container/PostContainer';
import axios from 'axios';

// TODO : Container 와 합치기.
// props 넘길때 object 넘기는건 권장 X
function PostViewPage(props) {
	const [IsEdit, setIsEdit] = useState(false);

	const postEdit = (
		<textarea id="post" style={{ width: '100%', padding: '10px' }}>
			{props.location.state.post}
		</textarea>
	);

	const postView = <p>{props.location.state.post}</p>;

	const onPostEditBtnHandler = (event) => {
		let body = {
			path: props.location.state.path,
			data: document.getElementById('post').value,
		};
		axios.post('/api/file/edit-post', body).then((response) => {
			props.history.push('/file');
		});
	};

	const onPostViewHandler = (event) => {
		setIsEdit(!IsEdit);
	};

	return (
		<PostContainer
			title={props.location.state.title}
			contents={IsEdit ? postEdit : postView}
			onClickHandler={IsEdit ? onPostEditBtnHandler : onPostViewHandler}
		/>
	);
}

export default withRouter(PostViewPage);