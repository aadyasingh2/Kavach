from openai import AsyncOpenAI
import os

client = AsyncOpenAI(
    base_url="https://models.inference.ai.azure.com",
    api_key=os.getenv("GITHUB_MODELS_KEY")
)

async def run_dependency_agent(files: dict) -> str:
    dep_files = {k: v for k, v in files.items() 
                if any(x in k.lower() for x in ["package.json", "requirements.txt", "pipfile", "poetry.lock", "yarn.lock", "package-lock.json"])}
    
    if not dep_files:
        return "No dependency files found in repository."
    
    content = ""
    for path, text in dep_files.items():
        content += f"\n--- {path} ---\n{text[:3000]}\n"

    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[{
            "role": "system",
            "content": "You are a dependency security agent. Analyze package files for outdated, vulnerable, or malicious dependencies. Reference known CVEs where applicable."
        }, {
            "role": "user",
            "content": f"Analyze these dependency files for security vulnerabilities:\n{content}"
        }],
        max_tokens=800
    )
    return response.choices[0].message.content