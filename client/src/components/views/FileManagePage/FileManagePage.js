import React, { useState, useRef } from 'react';
import axios from 'axios';
import { reactLocalStorage } from 'reactjs-localstorage';
import ReactDOM from 'react-dom'

function FileManagePage(props) {
	const [File, setFile] = useState(null);
	const [Email, setEmail] = useState(reactLocalStorage.get('email'));
	const [List, setList] = useState('');
	const ListParents = [];
	
	const onFileUploadHandler = (event) => {
		event.preventDefault();
		console.log("MyFILE : " ,File)
		console.log("Email : " , Email)
		if (File != null) {
			
			var formData = new FormData();
			
			formData.append('email', Email.replace('@', '.'));
			formData.append('file', File);
			
			axios.post('/api/file/upload', formData).then((response) => {
				console.log(response);

				if (!response.data.success) console.log(response);
				else {
					var list = response.data.data;
					var list_dom;
					// for(var i = 0 ; i < list.length ; i++){
					// 	setList(List + <ul>list[i]</ul>)
					// }
					console.log("list : " , list)
					listUp(list, 0);
					console.log("FINAL LIST : ", ListParents)
					var listPr = [];
					
					ListParents.forEach(ele => listPr.push(ele[0]));
					
					const myList = React.createElement('ul', {id:'root'}, [ListParents.forEach(ele => ele[0])]);
					ReactDOM.render(myList, document.getElementById('list-file'))
				}
			});
		} else {
			alert('파일을 먼저 선택해주세요');
		}
	};

	
	const listUp = (list, depth) => {
		ListParents.push({depth:[]})
		
		if(list.children){
			var children = list.children;
			var tempList = [];
			for(var i=0 ; i<children.length; i++){
				if(children[i].type === 'directory'){
					listUp(children[i], depth + 1)
					if(ListParents[depth + 1][0].length > 0){
						React.createElement('ul', {id:children[i].path}, ListParents[depth + 1][0])
						ListParents[depth + 1][0] = [] // 배열 초기화
					}
				}else if(children[i].type === 'file'){
					tempList.push(React.createElement('li', {id:children[i].path}, children[i].name))
				}
			}
			
			if(tempList.length > 0){
				ListParents[depth][0] = React.createElement('ul', null, tempList);
			}
		}
	};
	
	const onFileChangeHaldler = (event) => {
		// console.log(event.target.files[0])
		if (!/\.(zip|tar)$/i.test(event.target.files[0].name)) {
			alert('zip, tar 파일만 선택해 주세요.\n\n현재 파일 : ' + event.target.files[0]);
			setFile(null)
		}
		setFile(event.target.files[0])
	};

	return (
		<div className="file-body">
			<div className="container">
				<div className="file-form">
					<div>
						<form onSubmit={onFileUploadHandler} encType="multipart/form-data">
							<input
								type="file"
								accept=".zip, .tar"
								onChange={onFileChangeHaldler}
							/>
							<button type="submit" className="btn btn-outline-success">
								파일 업로드
							</button>
						</form>
					</div>
					<div id="list-file"></div>
				</div>
			</div>
		</div>
	);
}

export default FileManagePage;