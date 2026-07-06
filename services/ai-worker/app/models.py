from pydantic import BaseModel, Field


class EvidenceSignal(BaseModel):
    name: str
    detail: str


class EnrichmentRequest(BaseModel):
    investigation_title: str
    incident_description: str
    root_cause_title: str
    root_cause_description: str
    recommendation: str
    confidence: int = Field(ge=0, le=100)
    risk_score: int = Field(ge=0, le=100)
    detected_signals: list[str] = []


class EnrichmentResponse(BaseModel):
    provider: str
    mode: str
    reviewer_summary: str
    engineering_recommendation: str
    release_decision_rationale: str