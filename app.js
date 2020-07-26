const express = require('express')
const app = express()
const mongoose = require('mongoose');
const {User} = require('./model/User')
// == const Use = require('./model/User').User 와 같음
// ES6 문법이다. 
const bodyParser = require('body-parser')
const config = require('./config/key');
const cookieParser = require('cookie-parser')
//application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({extended:true}));

//application/json
app.use(bodyParser.json());
app.use(cookieParser())

mongoose.connect(config.mongoURI, {
	useCreateIndex:true, useFindAndModify:false, useUnifiedTopology: true, useNewUrlParser:true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


app.listen(3000, function(){
	console.log("start!")
});

 
app.post('/register', (req, res) => {
	const user = new User(req.body);

	// save 함수는 mongoDB에서 오는 함수임
	user.save((err, userInfo) => {
		if(err) return res.json({success : false, err})
		else return res.status(200).json({
			success : true
		});
	});
});

app.post('/login', (req, res)=>{
	
	// email을 db에서 조회
	User.findOne({email : req.body.email}, (err, userInfo) => {

		if(!userInfo){
			return res.json({
				loginSuccess : false,
				message : "일치하는 이메일이 없습니다."
			})
		}
		
		// email이 있다면 비밀번호 체크
		userInfo.comparePassword(req.body.password, (err, isMatch) => {
			if(!isMatch){
				return res.json({loginSuccess:false, message:"비밀번호가 틀렸습니다."});
			}

			//비밀번호까지 맞으면 토큰 생성.
			userInfo.generateToken((err, user) => {
				if(err) return res.status(400).send(err);

				res.cookie("x_auth", user.token)
				.status(200)
				.json({loginSuccess:true, userId: user._id});
			});
		});

	})

});


app.get('/', (req, res) => {
	res.send("<h1>hi friend!</h1>");
	//res.sendfile(__dirname + "/public/main.html")
});