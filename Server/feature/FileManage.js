/*
	1. fileUpload function
		1. 업로드된 파일이 zip 파일인지 확인
		2. 압축 풀고 파일들의 list를 client에 반환
		
	2. fileRead function
		1. 해당 경로의 파일을 읽어 내용을 return
	
	3. fileWrite function
		1. 해당 경로의 파일을 client가 수정한 내용으로 다시 만든 후 원래 내용 remove
*/

const fs = require('fs');
const basePath = 'uploads/';
const unzip = require('unzip');
const dirTree = require("directory-tree");

const uploadFile = (fileName, email, callback) => {

	//압출 파일인지 확인
	if (/\.(zip|tar)$/i.test(fileName)) {
		// 압축 해제된 파일이 저장될 dir path
		var mkdirPath = basePath + email + '/' + fileName.split('.')[0];
		// 압축 해제할 파일이 있는 path
		var path = basePath + email + '/' + fileName;

		// 압축 해제된 파일을 저장하기 위한 DIR 생성
		fs.mkdir(mkdirPath, { recursive: true }, (err) => {
			if (err) {
				console.log(err);
				return callback(err);
			}
			console.log(mkdirPath + ' : dir created');
		});   

		// 압축 해제
		fs.createReadStream(path).pipe(unzip.Extract({ path: mkdirPath }));

		// 압축 해체 후 파일 삭제
		fs.unlink(path, (err) => {
			if (err) {
				console.log(err);
				return callback(err);
			}
			console.log(fileName + ' del complete!');
		});
		
		const tree = dirTree(mkdirPath);
		console.log("tree : ", tree);
		callback(null, tree);
	}
};

// 초기 dir 반환
const readDir = (callback) => {
	callback();
};

const readFile = (path, callback) => {
	fs.readFile(basePath + path, 'utf-8', (err, data) => {
		if (err) return callback(err);
		callback(null, data);
	});
};

module.exports = { readDir, readFile, uploadFile };