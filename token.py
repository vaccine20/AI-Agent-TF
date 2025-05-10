from typing import Dict
from pydantic import BaseModel
from fastapi import APIRouter, Depends

from ...database import TokenManager  # Add this import

router = APIRouter()

token_manager = TokenManager()

class TokenRequest(BaseModel):
    token: str


@router.post("/")
async def refresh_token(request: TokenRequest) -> Dict:
    """token refresh"""

    print(f'old token ====> {request.token}')
    new_token = token_manager.jwt_reissue(request.token)


    return { "status": True, "data": new_token }
