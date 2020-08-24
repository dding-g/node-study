import React, { useState } from 'react';
import axios from 'axios';
import { reactLocalStorage } from 'reactjs-localstorage';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';

function FileManagePage(props) {
	// 초기 화면 모든 dir 보여줌
	axios.get('/api/file/dir-all').then((response) => {
		listUp(response.data.data);
		var listPr = [];

		for (var key in ListParents) {
			listPr.push(ListParents[key]);
		}

		const myList = React.createElement('ul', { id: 'root' }, listPr);
		ReactDOM.render(myList, document.getElementById('list-file'));
	});

	const [File, setFile] = useState(null);
	const ListParents = {};

	const onFileUploadHandler = (event) => {
		event.preventDefault();

		if (File != null) {
			var formData = new FormData();

			// 폴더 경로를 위해 @ 를 . 으로 치환
			formData.append('email', reactLocalStorage.get('email').replace('@', '.'));
			formData.append('file', File);

			axios.post('/api/file/upload', formData).then((response) => {
				if (!response.data.success) console.log(response);
				else {
					var list = response.data.data;
					listUp(list);
					var listPr = [];

					for (var key in ListParents) {
						listPr.push(ListParents[key]);
					}

					const myList = React.createElement('ul', { id: 'root' }, listPr);
					ReactDOM.render('', document.getElementById('list-file')); // TODO : render 여러번 X
					ReactDOM.render(myList, document.getElementById('list-file')); 
					alert('파일 업로드 완료');
				}
			});
		} else {
			alert('파일을 먼저 선택해주세요');
		}
	};

	const onReadFileHandler = (event) => {
		var readFilePath = event.currentTarget.id;
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
		ListParents[list.name] = []; // 탐색 깊이 별로 정리할 배열 추가

		// children이 있다는건 하위 directory 또는 file 이 있다는 뜻.
		if (list.children.length > 0) {
			var children = list.children;
			var tempList = [];
			for (var i = 0; i < children.length; i++) {
				if (children[i].type === 'directory') {
					listUp(children[i]); // 부모 path를 key로 주어 자식들을 저장
				} else if (children[i].type === 'file') {
					tempList.push(
						
						// TODO : CreateElement 사용 X, List, key doc 참고
						React.createElement(
							'li',
							{ id: children[i].path, onClick: onReadFileHandler },
							children[i].name
						)
					);
				}
			}

			if (tempList.length > 0) {
				var childElement = React.createElement('ul', null, tempList);
				var parentsElement = React.createElement('ul', null, [
					React.createElement('li', null, list.name),
					childElement,
				]);
				ListParents[list.name] = parentsElement;
			}
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
							<div id="list-file" className="list-form"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default withRouter(FileManagePage);