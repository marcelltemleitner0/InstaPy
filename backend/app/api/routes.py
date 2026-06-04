from core.config import COOKIES
from fastapi import APIRouter, HTTPException
from services.instagram_scanner import InstagramScanner

router = APIRouter()


@router.get("/following")
def get_following():
    scanner = InstagramScanner(COOKIES)
    data = scanner.get_all_following()

    return {"count": len(data), "results": data}


@router.post("/unfollow/{user_id}/")
def unfollow_user(user_id: int):
    scanner = InstagramScanner(COOKIES)

    response = scanner.unfollow(user_id)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=response.text,
        )

    return response.json()
