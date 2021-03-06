const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { User } = require('./model/User');
const { Chat } = require('./model/Chat')
const { auth } = require('./middleware/auth');

const bodyParser = require('body-parser');
const config = require('./config/key');
const cookieParser = require('cookie-parser');
const cookieStore = MongoStore(session);
const fs = require('fs');

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
	.connect(config.mongoURI, {
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.then(() => console.log('MongoDB Connected'))
	.catch((err) => console.log(err));

app.use(
	session({
		genid: function (req) {
			return uuidv4();
		},
		secret: 'secretKey',
		store: new cookieStore({
			mongooseConnection: mongoose.connection,
			ttl: 60 * 10, // 10분
		}), // 데이터를 저장하는 형식, FileStore, MongoStore 등
	})
);

app.listen(5000, function () {
	console.log('start!');
});

app.post('/api/users/register/emailValid', (req, res) => {
	User.findOne({ email: req.body.email }, (err, userInfo) => {
		if (err) return res.json({ success: false, err });
		else if (userInfo) return res.json({ success: true, emailExist: true });
		else return res.json({ success: true, emailExist: false });
	});
});

app.post('/api/users/register', (req, res) => {
	const user = new User(req.body);
	user.token = 'default';
	// save 함수는 mongoDB에서 오는 함수임
	user.save((err, userInfo) => {
		if (err) return res.json({ success: false, err });
		else {
			fs.mkdir('uploads/' + req.body.email.replace('@', '.'), { recursive: true }, (err) => {
				if (err) {
					console.log(err);
				}
				console.log('uploads/' + req.body.email + ' directory is created');
			});
			return res.status(200).json({
				success: true,
			});
		}
	});
});

app.post('/api/users/login', (req, res) => {
	// email을 db에서 조회
	User.findOne({ email: req.body.email }, (err, userInfo) => {
		if (!userInfo) {
			return res.json({
				loginSuccess: false,
				message: '일치하는 이메일이 없습니다.',
			});
		}
		// email이 있다면 비밀번호 체크
		userInfo.comparePassword(req.body.password, function (err, isMatch) {
			if (!isMatch) {
				return res.json({ loginSuccess: false, message: '비밀번호가 틀렸습니다.' });
			} else {
				req.session.isLogin = true;
				return req.session.save(function (err) {
					console.log('SESSION : ', req.sessionID);
					if (err)
						return res.status(500).json({
							loginSuccess: false,
							message: '세션을 저장하는데 실패했습니다.',
							err,
						});
					res.cookie('sessionCookie', req.sessionID)
						.status(200)
						.json({ loginSuccess: true, email: userInfo.email });
				});
			}
		});
	});
});

app.get('/api/users/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) res.json({ success: false, err });
		res.status(200).json({ success: true }).redirect('/');
	});
});

// auth : 여기서는 미들웨어
// 미들웨어는 client에서 request를 받고 callback function에 들어가기 전에 수행된다
app.get('/api/users/auth', (req, res) => {
	auth(req, res, null)
});

// ===== File Management API =====
const fileManage = require('./feature/FileManage');
const multer = require('multer');

// const upload = multer({dest:'uploads/'})
const upload = multer({
	storage: multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, 'uploads/' + req.body.email + '/');
		},
		filename: function (req, file, cb) {
			cb(null, file.originalname);
		},
	}),
});

app.post('/api/file/upload', upload.single('file'), (req, res) => {
	console.log('Uploaded File Name : ', req.file.originalname)
	
	fileManage.uploadFile(req.file.originalname, req.body.email, (err, initList) => {
		if (err) res.json({ successc: false, err });
		return res.status(200).json({ success: true, data: initList});
	});
});

app.get('/api/file/dir-all', (req, res) => {
	fileManage.readDir((data) => {
		res.status(200).json({ success: true, data: data });
	});
});

app.get('/api/file/read', (req, res) => {
	console.log("PATH : ", req.query.path);

	fileManage.readFile(req.query.path, (err, data) => {
		console.log(err)
		if (err) res.json({ success: false, err });
		else {
			console.log(data);
			var title = req.query.path.split('/')
			res.status(200).json({ success: true, post: data, title: title[title.length-1]});
		}
	});
});


app.post('/api/file/edit-post', (req, res)=>{
	fileManage.editFile(req.body.path, req.body.data, (err) => {
		if(err) res.json({success:false, err})
		else{
			res.status(200).json({success:true})
		}
	});
});


app.get('/api/chat/init-msg', (req,res) => {
	Chat.find({}, (err, data)=>{
		if(err) res.json({success:false, err})
		res.json({success:true, data:data})
	});
})