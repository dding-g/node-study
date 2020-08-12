const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')
const saltRounds = 10; // salt가 몇글자 인지를 나타냄

const userSchema = mongoose.Schema({
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
	socketid : String
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

const User = mongoose.model('User', userSchema);
module.exports = {User};