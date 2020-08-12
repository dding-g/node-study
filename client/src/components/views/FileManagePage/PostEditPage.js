import React, {useState} from 'react'
import axios from 'axios'
import {withRouter} from 'react-router-dom';

function PostEditPage(props) {
	
	const [Post, setPost] = useState(props.location.state.post)
	
	const onPostEditBtnHandler = (event) => {
		console.log(props.location.state.path)
		let body = {
			path:props.location.state.path,
			data:document.getElementById('post').value
		}
		axios.post('/api/file/edit-post', body)
		.then(response => {
			console.log("POST EDIT : ", response);
			props.history.push('/file-manage');
		});
	}
	
	const onCancleBtnHandler = (event) => {
		props.history.goBack();
		
	};
	
	const onTextChangeHandler = (event) =>{
		setPost(document.getElementById('post').value)
	}
	
	return (
		<div className='post-body'>
			<form>
				<p className='subject-font'>파일명</p>
				<hr/>
				<p id='title'>{props.location.state.title}</p>
				<hr/>
				<p className='subject-font'>내용</p>
				<hr/>
				<textarea id='post' onChange={onTextChangeHandler} style={{width:"100%", padding:"10px"}}>{Post}</textarea>
				<hr/>
				<button className='btn btn-primary' onClick={onPostEditBtnHandler} type="button">수정하기</button>
				<button className='btn btn-secondary' onClick={onCancleBtnHandler} type="button">취소</button>
			</form>
		</div>
	)
}

export default withRouter(PostEditPage);