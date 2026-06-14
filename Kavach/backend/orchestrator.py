import asyncio
from github_fetcher import get_all_files
from agents.planner import run_planner
from agents.secrets import run_secrets_agent
from agents.dependency import run_dependency_agent
from agents.logic import run_logic_agent
from agents.synthesizer import run_synthesizer

async def run_swarm(repo_url: str, progress_callback):
    parts = repo_url.rstrip("/").split("/")
    owner, repo = parts[-2], parts[-1]

    await progress_callback("fetching", "Fetching repository contents...")
    files = await get_all_files(owner, repo)
    
    if not files:
        return {"error": "Could not fetch repository. Make sure it's public."}

    await progress_callback("planner", "Planner agent analyzing attack surface...")
    planner_result = await run_planner(files)

    await progress_callback("secrets", "Secrets agent hunting credentials...")
    secrets_result = await run_secrets_agent(files)

    await progress_callback("dependency", "Dependency agent checking CVEs...")
    dependency_result = await run_dependency_agent(files)

    await progress_callback("logic", "Logic agent scanning for OWASP vulnerabilities...")
    logic_result = await run_logic_agent(files)

    await progress_callback("synthesizing", "Synthesizer compiling final report...")
    final_report = await run_synthesizer(planner_result, secrets_result, dependency_result, logic_result)

    return {
        "files_scanned": len(files),
        "agents": {
            "planner": planner_result,
            "secrets": secrets_result,
            "dependency": dependency_result,
            "logic": logic_result
        },
        "report": final_report
    }