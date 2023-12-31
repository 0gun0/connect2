import express from 'express';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {prisma} from '../utils/prisma/index.js';


// ES6 모듈 스타일, commonjs스타일... 

const router = express.Router();

// app.use(cors()); -> app.js에서 설정

// CORS 옵션 설정; 
// let corsOptions = {
//     origin: '*',      // 출처 허용 옵션
//     credential: true, // 사용자 인증이 필요한 리소스(쿠키 등) 접근
// }
// app.use(cors(corsOptions))

/** 사용자 회원가입 API **/

router.post('/sign-up', async(req, res, next)=>{

// 1. `email`, `password`, `name`, `age`, `gender`, `profileImage`를 **body**로 전달받습니다.
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
        name
    }
})
// 4. **UserInfos** 테이블에 `name`, `age`, `gender`, `profileImage`를 이용해 사용자 정보를 생성합니다.
// const userInfo = await prisma.userInfos.create({
//     data:{
//         UserId: user.userId,
//         name
//     }
// }) userInfo 테이블을 비움
return res.status(201).json({message:'회원가입이 완료되었습니다.'})
});

//리팩토링
// 로그인API

router.post('/sign-in', async (req, res, next) => {
  const { email, password } = req.body;

  const user = await prisma.users.findFirst({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: '존재하지 않는 이메일입니다.' });
  }

  const result = await bcrypt.compare(password, user.password);

  if (!result) {
    return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
  }

  // 시크릿 키를 환경 변수에서 가져옵니다.
  const secretKey = process.env.SECRET_KEY || 'default-secret-key';

  const token = jwt.sign(
    {
      userId: user.userId,
    },
    secretKey // 환경 변수에서 가져온 시크릿 키를 사용
  );

  res.cookie('authorization', `Bearer ${token}`);

  return res.status(200).json({ message: '로그인 성공', token: token });
});


/** 로그아웃 API */ 

router.post('/log-out', (req, res, next) => {
    try {
        // 클라이언트로부터 JWT 토큰을 받아옵니다.
        const token = req.headers.authorization.replace('Bearer ', ''); // 프론트에서 req.headers.authorization을 받음
        // 토큰을 블랙리스트에 추가하여 무효화시킨다.
        const blacklistedTokens = []; 
        blacklistedTokens.push(token); // 푸쉬, 블랙리스트에 토큰 추가
        // res.clearCookie('authorization'); // 클라이언트 쿠키 제거. 'authorization'라는 이름의 쿠키를 클라이언트에서 제거
        res.status(200).json({ message: '로그아웃 성공' });
    } catch (error) {
        // 오류가 발생한 경우 에러 응답을 보냅니다.
        console.log(error);
        res.status(500).json({ error: '로그아웃 중 오류가 발생했습니다.' });
    }
});

export default router;


