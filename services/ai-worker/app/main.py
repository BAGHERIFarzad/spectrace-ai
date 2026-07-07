from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException

from app.gemma_client import FireworksClient
from app.models import EnrichmentRequest, EnrichmentResponse

load_dotenv()

app = FastAPI(
    title="SpecTrace AI Worker",
    version="0.2.0",
    description="Evidence enrichment worker using Fireworks AI, prepared for AMD GPU / ROCm Gemma inference.",
)

fireworks_client = FireworksClient()


@app.get("/health")
async def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "spectrace-ai-worker",
        "provider": "Fireworks AI",
    }


@app.post("/api/enrich", response_model=EnrichmentResponse)
async def enrich_investigation(
    request: EnrichmentRequest,
) -> EnrichmentResponse:
    try:
        return await fireworks_client.enrich(request)

    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail=f"Fireworks AI enrichment failed: {str(error)}",
        ) from error