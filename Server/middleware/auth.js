const {User} = require('../model/User')

let auth = (req, res, next) => {

    // client의 쿠키에서 token을 가져옴
    let sessionID = req.cookies.sessionCookie;
    
    if(sessionID === req.sessionID){
        console.log("SESSION OK!!!!!!!!!!!");
        next();
    }else{
        console.log("SESSION EXPIRE!! REDIRECT!!!!!!!!!!!!");
        return res.redirect('/api/users/login');
    }
    
};

module.exports = {auth};