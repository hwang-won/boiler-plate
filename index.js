const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const config = require('./config/key');
const cookieParser = require('cookie-parser');

const { User } = require("./models/User");


// 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// 몽고DB 연결
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log('error'))

// test
app.get('/', (req, res) => {
    res.send('Hello World!!')
})

// 회원가입 정보
app.post('/register', (req, res) => {

    // 모든 정보 넣음
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    })  
})

app.post('/api/users/login', (req, res) => {
    
    // 요청된 이메일을 DB에서 찾음
    User.findOne({email: req.body.email}, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
    // 요청된 이메일이 DB에 있다면 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {

        if(!isMatch)
        return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})


         // 맞다면 토큰 생성
        user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);

            // 쿠키에 토큰 저장
            res.cookie("x_auth", user.token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
})





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

