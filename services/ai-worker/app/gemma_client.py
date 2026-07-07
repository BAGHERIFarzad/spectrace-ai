import json
import os
from typing import Any

from dotenv import load_dotenv
from openai import OpenAI

from app.models import EnrichmentRequest, EnrichmentResponse

load_dotenv()


class FireworksClient:
    def __init__(self) -> None:
        self.api_key = os.getenv("FIREWORKS_API_KEY")
        self.model = os.getenv(
            "FIREWORKS_MODEL",
            "accounts/fireworks/models/deepseek-v3p1",
        )

        if not self.api_key:
            raise RuntimeError(
                "FIREWORKS_API_KEY is missing. Add it to services/ai-worker/.env."
            )

        self.client = OpenAI(
            base_url="https://api.fireworks.ai/inference/v1",
            api_key=self.api_key,
        )

    async def enrich(
        self,
        request: EnrichmentRequest,
    ) -> EnrichmentResponse:
        result = self.enrich_investigation(
            investigation_title=request.investigation_title,
            incident_description=request.incident_description,
            root_cause_title=request.root_cause_title,
            root_cause_description=request.root_cause_description,
        )

        return EnrichmentResponse(
            provider="Fireworks AI",
            mode="remote",
            reviewer_summary=result["reviewer_summary"],
            engineering_recommendation=result["engineering_recommendation"],
            release_decision_rationale=result["release_decision_rationale"],
        )

    def enrich_investigation(
        self,
        investigation_title: str,
        incident_description: str,
        root_cause_title: str,
        root_cause_description: str,
    ) -> dict[str, Any]:
        system_prompt = """
You are SpecTrace AI, an engineering incident-analysis assistant.

Return ONLY valid JSON. Do not add markdown fences.

Use exactly this JSON structure:
{
  "reviewer_summary": "short engineering summary",
  "engineering_recommendation": "specific action plan",
  "release_decision_rationale": "why a human reviewer should approve, request changes, or block release"
}
""".strip()

        user_prompt = f"""
Investigation title:
{investigation_title}

Incident description:
{incident_description}

Initial root-cause hypothesis:
{root_cause_title}

Root-cause details:
{root_cause_description}
""".strip()

        completion = self.client.chat.completions.create(
            model=self.model,
            temperature=0.2,
            max_tokens=700,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )

        content = completion.choices[0].message.content

        if not content:
            raise RuntimeError("Fireworks returned an empty AI response.")

        try:
            return json.loads(content)
        except json.JSONDecodeError as error:
            raise RuntimeError(
                f"Fireworks returned invalid JSON: {content}"
            ) from error