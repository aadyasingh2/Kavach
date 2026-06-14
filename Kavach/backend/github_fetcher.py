import httpx
import os
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
HEADERS = {"Authorization": f"Bearer {GITHUB_TOKEN}", "Accept": "application/vnd.github+json"}

async def fetch_repo_contents(owner: str, repo: str, path: str = "") -> list:
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers=HEADERS)
        return resp.json()

async def fetch_file_content(download_url: str) -> str:
    async with httpx.AsyncClient() as client:
        resp = await client.get(download_url)
        return resp.text

async def get_all_files(owner: str, repo: str, path: str = "", depth: int = 0) -> dict:
    if depth > 3:
        return {}
    
    contents = await fetch_repo_contents(owner, repo, path)
    files = {}
    
    if not isinstance(contents, list):
        return {}

    for item in contents:
        if item["type"] == "file" and item["size"] < 100000:
            ext = item["name"].split(".")[-1].lower()
            if ext in ["py", "js", "ts", "jsx", "tsx", "json", "env", "yaml", "yml", "txt", "md", "toml", "cfg"]:
                try:
                    content = await fetch_file_content(item["download_url"])
                    files[item["path"]] = content
                except:
                    pass
        elif item["type"] == "dir":
            sub = await get_all_files(owner, repo, item["path"], depth + 1)
            files.update(sub)
    
    return files