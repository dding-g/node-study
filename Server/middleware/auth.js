const {User} = require('../model/User')

let auth = (req, res, next) => {

    // client의 쿠키에서 token을 가져옴
    let sessionID = req.cookies.sessionCookie;
    
    if(sessionID === req.sessionID){
        console.log("SESSION OK!!!!!!!!!!!");
		if(next === null)
			return res.status(200).json({success:true, isAuth:true})
        next();
    }else{
        console.log("SESSION EXPIRE!! REDIRECT!!!!!!!!!!!!");
        return res.status(200).json({success:true, isAuth:false})
    }
    
};

module.exports = {auth};