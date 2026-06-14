from openai import AsyncOpenAI
import os

client = AsyncOpenAI(
    base_url="https://models.inference.ai.azure.com",
    api_key=os.getenv("GITHUB_MODELS_KEY")
)

async def run_logic_agent(files: dict) -> str:
    code_files = {k: v for k, v in files.items() 
                 if k.endswith((".py", ".js", ".ts", ".jsx", ".tsx"))}
    
    content = ""
    for path, text in list(code_files.items())[:8]:
        content += f"\n--- {path} ---\n{text[:2000]}\n"

    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[{
            "role": "system",
            "content": "You are a code logic security agent. Find SQL injection, XSS, CSRF, insecure auth, broken access control, and other OWASP Top 10 vulnerabilities. Be specific with file paths and code snippets."
        }, {
            "role": "user",
            "content": f"Analyze this code for logic vulnerabilities:\n{content}"
        }],
        max_tokens=800
    )
    return response.choices[0].message.content