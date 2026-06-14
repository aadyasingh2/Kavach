from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import json
import asyncio

load_dotenv()

from orchestrator import run_swarm

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

class RepoRequest(BaseModel):
    repo_url: str

@app.post("/analyze")
async def analyze(request: RepoRequest):
    async def stream():
        updates = []
        
        async def progress_callback(stage: str, message: str):
            update = json.dumps({"stage": stage, "message": message})
            updates.append(update)

        async def generate():
            swarm_task = asyncio.create_task(run_swarm(request.repo_url, progress_callback))
            
            while not swarm_task.done():
                while updates:
                    yield f"data: {updates.pop(0)}\n\n"
                await asyncio.sleep(0.1)
            
            while updates:
                yield f"data: {updates.pop(0)}\n\n"
            
            result = swarm_task.result()
            yield f"data: {json.dumps({'stage': 'complete', 'result': result})}\n\n"

        async for chunk in generate():
            yield chunk

    return StreamingResponse(stream(), media_type="text/event-stream")

@app.get("/health")
async def health():
    return {"status": "ok"}