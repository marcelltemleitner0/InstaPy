from core.config import COOKIES
from fastapi import APIRouter
from services.instagram_scanner import InstagramScanner

router = APIRouter()


@router.get("/following")
def get_following():
    scanner = InstagramScanner(COOKIES)
    data = scanner.get_all_following()

    return {"count": len(data), "results": data}
