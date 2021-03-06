const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        dafault: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
    
})

// 유저 정보를 저장하기 전에 아래 내용을 실행 한 후 user.save로 감
userSchema.pre('save', function(next){

    var user = this;

    if(user.isModified('password')) {
    
        // 비밀번호 암호화 bcrypt - Salt
        // https://www.npmjs.com/package/bcrypt
        bcrypt.genSalt(saltRounds, function(err, salt) {
        
            if(err) return next(err);

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    
    // 비밀번호와 DB의 암호화된 비밀번호와 같은지 확인 
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;

    // jsonwebtoken 이용해서 token 생성
    // https://www.npmjs.com/package/jsonwebtoken
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token;
    user.save(function (err, user) {
        if (err) return cb(err);
        cb(null, user);
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    //user._id + '' = token;
    // 토큰을 디코드 한다.
    jwt.verify(token, 'secretToken', function (err, decoded) {
        //유저 아이디를 이용해서 유저를 찾은 다음에 
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({ "_id": decoded, "token": token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user)
        })
    })
}


const User = mongoose.model('User', userSchema)

module.exports = { User }