const {User} = require('../model/User')

let auth = (req, res, next) => {

    //인증 처리를 하는곳.

    // client의 쿠키에서 token을 가져옴
    let token = req.cookies.x_auth;
    
    // 가져온 token을 복호화 한 후 User를 찾는다.
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({isAuth:false, error:true});

        req.token = token;
        req.user = user;

        next(); // middleware에서 빠져나감
    })
    // User 가 있으면 인증 OK, 없으면 No
};

module.exports = {auth};