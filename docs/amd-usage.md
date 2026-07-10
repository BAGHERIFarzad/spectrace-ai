# AMD Usage and Runtime Validation

SpecTrace AI was built for the AMD Developer Hackathon: ACT II.

## Current Live Runtime

The current live demo uses:

- Vercel for the Next.js frontend
- Render for the .NET API backend
- Render for the Python FastAPI AI worker
- Fireworks AI serverless inference for AI enrichment

## AMD GPU Access

AMD AI Notebook access was allocated during the hackathon and validated with a runtime environment check.

Validation screenshots:

- `docs/screenshots/amd-ai-notebook-access.png`
- `docs/screenshots/amd-runtime-validation.png`

## AMD-Ready Runtime Direction

SpecTrace is designed so its AI worker can evolve toward:

- AMD Developer Cloud execution
- ROCm/GPU-backed inference
- Gemma-style model routing
- Screenshot evidence analysis
- Video-frame evidence extraction
- Larger multimodal evidence-correlation workloads

## Honest Runtime Statement

The production demo is deployed on Vercel and Render today. AMD AI Notebook access is validated and prepared for the next acceleration phase. This keeps the submission honest while showing a clear AMD platform pathway.