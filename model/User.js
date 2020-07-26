const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // salt가 몇글자 인지를 나타냄
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength : 30
    },
    email : {
        type : String,
        maxlength : 50,
        unique : 1
    },
    password : {
        type : String,
        minlength : 5,
        maxlength : 128
    },
    lastname : {
        type : String,
        maxlength : 50
    },
    role : {
        type : Number,
        default : 0
    },
    image : String,
    token : {
        type : String
    },
    tokenExp : {
        type : Number
    }
});

// user 정보를 저장하기전에 어떤 작업을 한다.
userSchema.pre('save', function (next) {
    var user = this; //위의 스키마를 가르킴

    //model안의 filed에서 password가 바뀔 때만 암호화를 해줌.
    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err); // salt를 생성하지 못한 경우
    
            //hash가 암호화된 비밀번호
            bcrypt.hash(user.password, salt, function(err, hash) {
                // Store hash in your password DB.
                if(err) return next(err); // hash(암호화된 비밀번호) 를 만들지 못한 경우
                user.password = hash
                next();
            });
        });
    }
});


userSchema.methods.comparePassword = function(plainPassword, cb){
    //plainpasswrod : 입력된 password

    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    })

};

userSchema.methods.generateToken = function(cb){
    //jwt 사용해서 웹 토큰 생성
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token;
    user.save(function (err, user) {
        if(err) return cb(err);
        cb(null, user);
    });
};

const User = mongoose.model('User', userSchema);
module.exports = {User};