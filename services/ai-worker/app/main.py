from dotenv import load_dotenv
from fastapi import FastAPI

from app.gemma_client import GemmaClient
from app.models import EnrichmentRequest, EnrichmentResponse

load_dotenv()

app = FastAPI(
    title="SpecTrace AI Worker",
    version="0.1.0",
    description="Evidence enrichment worker prepared for AMD GPU / ROCm Gemma inference.",
)

gemma_client = GemmaClient()


@app.get("/health")
async def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "spectrace-ai-worker",
    }


@app.post("/api/enrich", response_model=EnrichmentResponse)
async def enrich_investigation(
    request: EnrichmentRequest,
) -> EnrichmentResponse:
    return await gemma_client.enrich(request)