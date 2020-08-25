import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { reactLocalStorage } from 'reactjs-localstorage';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import LoginBanner from '../../banners/LoginBanner/LoginBanner';

function FileManagePage(props) {
	const [File, setFile] = useState(null);
	let ListParents = [];
	const [FileList, setFileList] = useState();

	useEffect(() => {
		// 초기 화면 모든 dir 보여줌
		axios.get('/api/file/dir-all').then((response) => {
			console.log(response);
			setFileList(listUp(response.data.data));
		});
	}, []);

	const onFileUploadHandler = (event) => {
		event.preventDefault();

		if (File != null) {
			let formData = new FormData();

			// 폴더 경로를 위해 @ 를 . 으로 치환
			formData.append('email', reactLocalStorage.get('email').replace('@', '.'));
			formData.append('file', File);

			axios.post('/api/file/upload', formData).then((response) => {
				if (!response.data.success) console.log(response.data.err);
				else {
					setFileList(listUp(response.data.data));
					alert('파일 업로드 완료');
				}
			});
		} else {
			alert('파일을 먼저 선택해주세요');
		}
	};

	const onReadFileHandler = (event) => {
		let readFilePath = event.currentTarget.id;
		axios
			.get('/api/file/read', {
				params: {
					path: readFilePath,
				},
			})
			.then((response) => {
				return props.history.push({
					pathname: '/file/post',
					state: {
						title: response.data.title,
						post: response.data.post,
						path: readFilePath,
					},
				});
			});
	};

	const listUp = (list) => {
		// children이 있다는건 하위 directory 또는 file 이 있다는 뜻.
		if (list.children.length > 0) {
			let children = list.children;
			return children.map((child) => {
				if (child.type === 'directory') {
					return (
						<ul>
							<li key={child.id} className="list-forder">
								{child.name}
							</li>
							{listUp(child)}
						</ul>
					);
				} else if (child.type === 'file') {
					return (
						<ul>
							<li id={child.path} className="list-file" onClick={onReadFileHandler}>
								{child.name}
							</li>
						</ul>
					);
				}
			});
		}
	};

	const onFileChangeHaldler = (event) => {
		if (!/\.(zip|tar)$/i.test(event.target.files[0].name)) {
			alert('zip, tar 파일만 선택해 주세요.\n\n현재 파일 : ' + event.target.files[0]);
			setFile(null);
		}
		setFile(event.target.files[0]);
	};

	return (
		<div>
			<LoginBanner />

			<div className="file-body">
				<div className="container">
					<div className="row">
						<div className="col-sm">
							<div className="file-form">
								<form onSubmit={onFileUploadHandler} encType="multipart/form-data">
									<input
										type="file"
										accept=".zip, .tar"
										onChange={onFileChangeHaldler}
									/>
									<button
										type="submit"
										className="btn btn-outline-success"
										style={{ marginTop: '30px' }}
									>
										파일 업로드
									</button>
								</form>
							</div>
						</div>

						<div className="col-sm">
							<div style={{ height: '300px' }}>
								<div
									className="subject-font"
									style={{ width: '100%', textAlign: 'left' }}
								>
									<p>파일 리스트</p>
									<hr />
								</div>
								<div id="list-file" className="list-form">
									<ul>{FileList}</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default withRouter(FileManagePage);