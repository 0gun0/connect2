import crypto from 'crypto';
import fs from 'fs';

// 랜덤한 32바이트 시퀀스를 생성하고 base64 문자열로 변환
const secretKey = crypto.randomBytes(32).toString('base64');

// .env 파일에 시크릿 키 저장
fs.writeFileSync('.env', `SECRET_KEY=${secretKey}`);
console.log('생성된 시크릿 키를 .env 파일에 저장했습니다.');