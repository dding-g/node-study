const express = require('express')
const app = express()
const mongoose = require('mongoose');
const {User} = require('./model/User')
// == const Use = require('./model/User').User 와 같음
// ES6 문법이다. 
const bodyParser = require('body-parser')
const config = require('./config/key');
//application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({extended:true}));

//application/json
app.use(bodyParser.json());

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

app.get('/', function(req, res){
	res.send("<h1>hi friend!</h1>");
	//res.sendfile(__dirname + "/public/main.html")
});