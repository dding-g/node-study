import { withRouter, Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

// TODO : Container 와 합치기.
// props 넘길때 object 넘기는건 권장 X
function PostViewPage(props) {
	const [IsEdit, setIsEdit] = useState(false);
	const [Post, setPost] = useState(props.location.state.post);

	const onPostEditBtnHandler = async (event) => {
		let body = {
			path: props.location.state.path,
			data: Post,
		};
		try{
			const response = await axios.post('/api/file/edit-post', body);
			if(response.data.success) {
				alert('수정 성공!')
				props.history.push('/file');	
			}else{
				alert('수정 실패 : ', response.err);
			}
			
		}catch(error){
			alert('수정 실패 : ', error);
		}
		
	};
	
	const onPostViewBtnHandler = (event) => {
		setIsEdit(!IsEdit);
	};
	
	const onPostChangeHandler = (e) => {
		setPost(e.target.value);
	}

	return (
		<div className="post-page-body">
			<div>
				<p className="subject-font">파일명</p>
				<hr />
				<p id="title">{props.location.state.title}</p>
				<hr />
			</div>

			<div>
				<p className="subject-font">내용</p>
				<hr />
				{IsEdit && (
					<textarea id="post" style={{ width: '100%', padding: '10px' }} defaultValue = {Post} onChange={onPostChangeHandler}/>
				)}

				{!IsEdit && <p>{props.location.state.post}</p>}
				<hr />
			</div>

			<div>
				<button
					type="button"
					className="btn btn-primary"
					onClick={IsEdit ? onPostEditBtnHandler : onPostViewBtnHandler}
				>
					수정하기
				</button>
				<Link to="/file">
					<button type="button" className="btn btn-secondary">
						취소
					</button>
				</Link>
			</div>
		</div>
	);
}

export default withRouter(PostViewPage);