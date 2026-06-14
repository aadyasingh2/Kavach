from openai import AsyncOpenAI
import os

client = AsyncOpenAI(
    base_url="https://models.inference.ai.azure.com",
    api_key=os.getenv("GITHUB_MODELS_KEY")
)

async def run_planner(files: dict) -> str:
    file_list = "\n".join(files.keys())
    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[{
            "role": "system",
            "content": "You are a security planning agent. Analyze the repository structure and identify the highest risk areas and attack surfaces. Be specific and technical."
        }, {
            "role": "user",
            "content": f"Repository files:\n{file_list}\n\nIdentify the top security risk areas in this codebase structure."
        }],
        max_tokens=800
    )
    return response.choices[0].message.content