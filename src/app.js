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
app.use(cookieParser());
app.use('/api', [UsersRouter]);
app.use(cors(corsOptions))

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});


