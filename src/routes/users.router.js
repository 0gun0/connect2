import express from 'express';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {prisma} from '../utils/prisma/index.js';

// ES6 모듈 스타일, commonjs스타일... -> app.js에서 

const router = express.Router();


// CORS 옵션 설정; 
// let corsOptions = {
//     origin: '*',      // 출처 허용 옵션
//     credential: true, // 사용자 인증이 필요한 리소스(쿠키 등) 접근
// }
// app.use(cors(corsOptions))

/** 사용자 회원가입 API **/

router.post('/sign-up', async(req, res, next)=>{

// 1. `email`, `password`, `name`, 를 **body**로 전달받습니다.
const {email, password, name} = req.body;
// 2. 동일한 `email`을 가진 사용자가 있는지 확인합니다.
const isExistUser = await prisma.users.findFirst({
    where: {email},
});
if(isExistUser){
    return res.status(409).json({message : '이미 존재하는 이메일입니다.'});
}
// 3. **Users** 테이블에 `email`, `password`를 이용해 사용자를 생성합니다.
const hashedPassword = await bcrypt.hash(password, 10);

const user = await prisma.users.create({
    data: {
        email, 
        password: hashedPassword,
    }
})
// 4. **UserInfos** 테이블에 `name`, `age` 를 이용해 사용자 정보를 생성합니다.
const userInfo = await prisma.userInfos.create({
    data:{
        UserId: user.userId,
        name,
    }
})
return res.status(201).json({message:'회원가입이 완료되었습니다.'})
});

/** 사용자 로그인 API **/
router.post('/sign-in', async (req, res, next)=>{
    const {email, password} = req.body;

const user = await prisma.users.findFirst({where: {email}});
if (!user){
    return res.status(401).json({message : '존재하지 않는 이메일입니다.'});
}
const result = await bcrypt.compare(password, user.password);
if(!result){
    return res.status(401).json({message : '비밀번호가 일치하지 않습니다.'})
}
const token = jwt.sign(
    {
        userId: user.userId,
    },
    'customized_secret_key',
)
res.cookie('authorization',`Bearer ${token}`);

return res.status(200).json({message : '로그인 성공'});
})

export default router;


