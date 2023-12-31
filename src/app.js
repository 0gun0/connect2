import express from 'express';
import cookieParser from 'cookie-parser';
import UsersRouter from './routes/users.router.js'
import cors from 'cors';

let corsOptions = {
  origin: '*',      // 출처 허용 옵션
  credential: true, // 사용자 인증이 필요한 리소스(쿠키 등) 접근
}

const app = express();
const PORT = 3018;

app.use(express.json());
app.use(cors(corsOptions)); //순서바꿈
app.use(cookieParser());
app.use('/api', [UsersRouter]);
app.use(express.urlencoded({ extended: true })); //URL encoded 추가. req.body값을 객체로 받아야함


app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});


