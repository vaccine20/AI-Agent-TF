from typing import Dict

from fastapi import APIRouter, Depends, HTTPException

from ...database import DatabaseManager, TokenManager  # added by sun
from ...datamodel import Account
from ..deps import get_db

router = APIRouter()
token_manager = TokenManager()


@router.post("/login")
async def login(account: Account, db: DatabaseManager = Depends(get_db)) -> Dict:
    """이메일로 로그인"""

    try:
        userInfo = db.authenticate(account)
    except Exception as e:
        raise e

    print(f'userInfo ===> {userInfo}')
    
    token = token_manager.get_jwt_token(userInfo)

    return { "status": True, "data": token }


## logout api 추가
# @router.post("/logout")
# async def logout(token: str, db: DatabaseManager = Depends(get_db)) -> Dict:
#     """로그아웃"""

#     return { "status": True, "data": 'logout_success' }
