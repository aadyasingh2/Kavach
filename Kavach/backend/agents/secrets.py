from openai import AsyncOpenAI
import os

client = AsyncOpenAI(
    base_url="https://models.inference.ai.azure.com",
    api_key=os.getenv("GITHUB_MODELS_KEY")
)

async def run_secrets_agent(files: dict) -> str:
    sensitive_files = {k: v for k, v in files.items() 
                      if any(x in k.lower() for x in ["env", "config", "secret", "key", "token", "password"])}
    
    all_content = ""
    for path, content in list(files.items())[:10]:
        all_content += f"\n--- {path} ---\n{content[:2000]}\n"

    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[{
            "role": "system",
            "content": "You are a secrets detection agent. Hunt for hardcoded API keys, passwords, tokens, credentials, and sensitive data exposure. List every finding with file path and line context."
        }, {
            "role": "user",
            "content": f"Scan this code for secrets and credential leaks:\n{all_content}"
        }],
        max_tokens=800
    )
    return response.choices[0].message.content