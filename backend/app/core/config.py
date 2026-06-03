import os

from dotenv import load_dotenv

load_dotenv()

SESSIONID = os.getenv("SESSIONID")
DS_USER_ID = os.getenv("DS_USER_ID")
CSRFTOKEN = os.getenv("CSRFTOKEN")

if not SESSIONID or not DS_USER_ID or not CSRFTOKEN:
    raise ValueError("Missing environment variables in .env file")


COOKIES = {
    "ds_user_id": DS_USER_ID,
    "sessionid": SESSIONID,
    "csrftoken": CSRFTOKEN,
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "x-ig-app-id": "936619743392459",
    "x-csrftoken": CSRFTOKEN,
    "Referer": "https://www.instagram.com/",
}
