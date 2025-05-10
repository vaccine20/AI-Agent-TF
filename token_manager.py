import threading
from datetime import datetime, timedelta
from fastapi import HTTPException

from ..datamodel import Response, Team, Account

import jwt

## 김선용 추가 파일

class TokenManager:
    _init_lock = threading.Lock()
    test_sk = 'ksyksyksyksyksyksyksyksyksyksy'    

    
    def get_jwt_token(self, account : Account):
        expired_second = 43200

        payload = {
            "user_id": account.email,
            "exp": int((datetime.now() + timedelta(seconds=expired_second)).timestamp())
        }
        token = self.jwt_issue(payload)
        return token


    ## jwt 발급 함수 추가
    def jwt_issue(self, payload):
        
        return jwt.encode(payload, self.test_sk, algorithm="HS256")
    
    def jwt_reissue(self, token):

        decoded_token = jwt.decode(token, self.test_sk, algorithms=['HS256'])
        decoded_token['exp'] = int((datetime.now() + timedelta(seconds=3600)).timestamp())

        return jwt.encode(decoded_token, self.test_sk, algorithm='HS256')
    
    ## 토큰 검증
    def verify_token(self, token):
        refresh_second = 1200
        try:
            decoded_token = jwt.decode(token, self.test_sk, algorithms=['HS256'])

            if not isinstance(decoded_token, dict) or 'exp' not in decoded_token:
                raise HTTPException(status_code=401, detail={
                    'message': "Invalid Token Structure",
                    'data': []
                })

            exp_timestamp = int(decoded_token['exp'])
            now_timestamp = int(datetime.now().timestamp())

            print(f'token exp count ====> {exp_timestamp-now_timestamp}')

            if now_timestamp > exp_timestamp:
                raise HTTPException(status_code=401, detail={
                    'message': "Token has expired",
                    'data': []
                })

            if (exp_timestamp - now_timestamp) < refresh_second:
                raise HTTPException(status_code=401, detail={
                    'message': "Token is about to expire",
                    'data': []
                })

            return decoded_token
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail={
                'message': "Token has expired",
                'data': []
            })
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail={
                'message': "Invalid token",
                'data': []
            })