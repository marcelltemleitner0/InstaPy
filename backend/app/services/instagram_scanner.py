import json
import time

import httpx
from core.config import HEADERS
from models.instagramuser import InstagramUser


class InstagramScanner:
    def __init__(self, cookies: dict):
        self.session = httpx.Client()
        self.session.cookies.update(cookies)
        self.session.headers.update(HEADERS)
        self.user_id = cookies["ds_user_id"]

    def _build_url(self, after: str = ""):
        variables = {
            "id": self.user_id,
            "include_reel": "true",
            "fetch_mutual": "false",
            "first": "24",
        }

        if after:
            variables["after"] = after

        return (
            "https://www.instagram.com/graphql/query/",
            {
                "query_hash": "3dec7e2c57367ef3da3d987d89f9dbc8",
                "variables": json.dumps(variables),
            },
        )

    def get_all_following(self) -> list[InstagramUser]:
        results = []
        cursor = ""
        call_count = 0

        while True:
            url, params = self._build_url(after=cursor)
            resp = self.session.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()
            follow_data = data["data"]["user"]["edge_follow"]
            results.extend(
                InstagramUser(
                    id=int(edge["node"]["id"]),
                    username=edge["node"]["username"],
                    follows_viewer=edge["node"]["follows_viewer"],
                    profile_pic_url=edge["node"]["profile_pic_url"],
                )
                for edge in follow_data["edges"]
            )
            if not follow_data["page_info"]["has_next_page"]:
                break

            cursor = follow_data["page_info"]["end_cursor"]
            call_count += 1

            if call_count % 10 == 0:
                time.sleep(30)
            else:
                time.sleep(1.5)

        return results
