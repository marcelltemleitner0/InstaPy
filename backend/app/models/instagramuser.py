from pydantic import BaseModel


class InstagramUser(BaseModel):
    id: int
    username: str
    follows_viewer: bool
    profile_pic_url: str
