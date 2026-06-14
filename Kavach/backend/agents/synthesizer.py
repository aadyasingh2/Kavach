from openai import AsyncOpenAI
import os

client = AsyncOpenAI(
    base_url="https://models.inference.ai.azure.com",
    api_key=os.getenv("GITHUB_MODELS_KEY")
)

async def run_synthesizer(planner: str, secrets: str, dependency: str, logic: str) -> str:
    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[{
            "role": "system",
            "content": "You are a security report synthesizer. Combine findings from multiple security agents into a clear, prioritized security report. Use CRITICAL/HIGH/MEDIUM/LOW severity ratings. End with a prioritized fix list."
        }, {
            "role": "user",
            "content": f"""Synthesize these agent findings into a final security report:

PLANNER AGENT:
{planner}

SECRETS AGENT:
{secrets}

DEPENDENCY AGENT:
{dependency}

LOGIC AGENT:
{logic}

Produce a structured security report with executive summary, findings by severity, and top 5 immediate actions."""
        }],
        max_tokens=1200
    )
    return response.choices[0].message.content