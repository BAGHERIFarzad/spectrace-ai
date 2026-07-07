from pydantic import BaseModel, Field


class EnrichmentRequest(BaseModel):
    investigation_title: str = Field(min_length=3)
    incident_description: str = Field(min_length=10)
    root_cause_title: str = Field(min_length=3)
    root_cause_description: str = Field(min_length=10)


class EnrichmentResponse(BaseModel):
    provider: str
    mode: str
    reviewer_summary: str
    engineering_recommendation: str
    release_decision_rationale: str