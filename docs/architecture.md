# SpecTrace Architecture

SpecTrace is an Evidence Intelligence Platform that turns fragmented product evidence into traceable release decisions.

The system is built as a modular full-stack application with three main services:

- Next.js Web App
- .NET API Backend
- Python FastAPI AI Worker

---

## Live Deployment

- Frontend: `https://spectrace-ai.vercel.app`
- API: `https://spectrace-api.onrender.com`
- AI Worker: `https://spectrace-ai-worker.onrender.com`

---

## High-Level Flow

```text
User uploads evidence
        ↓
Next.js workspace
        ↓
.NET API receives investigation request
        ↓
Evidence analyzer extracts technical signals
        ↓
Python AI worker enriches the investigation
        ↓
SpecTrace generates:
- Root-cause hypothesis
- Evidence timeline
- Evidence graph
- Playwright regression test draft
- GitHub issue draft
- Acceptance criteria draft
- Human approval gate
```

---

## Frontend

Path:

```text
apps/web
```

Technology:

- Next.js
- React
- TypeScript
- CSS

Responsibilities:

- Product evidence upload UI
- Incident context form
- Investigation dashboard
- Evidence timeline
- Evidence graph
- AI reasoning layer
- Generated engineering asset preview
- Human approval gate
- Judge Mode alignment section
- AI Runtime Strategy section
- Evaluation Scenarios section
- AMD Platform Integration section

The frontend is deployed on Vercel:

```text
https://spectrace-ai.vercel.app
```

The frontend calls the backend API through the environment variable:

```text
NEXT_PUBLIC_API_BASE_URL=https://spectrace-api.onrender.com
```

For local development, the frontend can fall back to:

```text
http://localhost:5166
```

---

## Backend API

Path:

```text
apps/api
```

Technology:

- .NET 10 API
- C#
- Docker

Responsibilities:

- Accept uploaded evidence
- Store runtime evidence references locally
- Create investigation reports
- Analyze log evidence
- Call the AI worker
- Generate deterministic fallback reasoning if the AI worker is unavailable
- Return a complete traceable analysis report to the frontend
- Provide health check endpoints for deployment monitoring

The backend API is deployed on Render:

```text
https://spectrace-api.onrender.com
```

Important API endpoints:

```text
GET  /
GET  /healthz
POST /api/analyses/demo
POST /api/evidence/upload
POST /api/analyses/investigate
```

Deployment health check endpoint:

```text
/
```

or:

```text
/healthz
```

---

## Python AI Worker

Path:

```text
services/ai-worker
```

Technology:

- Python
- FastAPI
- Fireworks AI compatible OpenAI client

Responsibilities:

- Receive incident and root-cause context
- Call remote AI inference
- Return structured JSON enrichment:
  - Reviewer summary
  - Engineering recommendation
  - Release decision rationale

The AI worker is deployed on Render:

```text
https://spectrace-ai-worker.onrender.com
```

FastAPI documentation endpoint:

```text
https://spectrace-ai-worker.onrender.com/docs
```

---

## AI Runtime Strategy

SpecTrace supports a modular AI runtime strategy.

Current live demo mode:

- Fireworks AI serverless inference
- Python FastAPI AI worker
- Render deployment

Fallback mode:

- SpecTrace deterministic local fallback
- .NET evidence analyzer
- No remote AI dependency required

Future AMD-ready mode:

- AMD Developer Cloud
- AMD ROCm
- Gemma-style inference
- GPU-backed multimodal evidence reasoning

The architecture is designed so the AI worker can route evidence reasoning to different model runtimes without changing the core product workflow.

---

## Runtime Routing Model

```text
Evidence + Incident Context
        ↓
.NET API
        ↓
Log Evidence Analyzer
        ↓
AI Worker Request
        ↓
┌───────────────────────────────────────────┐
│ Runtime Route                             │
├───────────────────────────────────────────┤
│ 1. Fireworks AI serverless route          │
│ 2. Deterministic fallback route           │
│ 3. Future AMD / ROCm / Gemma route        │
└───────────────────────────────────────────┘
        ↓
Reviewer Summary
Engineering Recommendation
Release Decision Rationale
```

---

## Resilience

SpecTrace is designed to remain demo-safe.

If the AI worker or remote AI provider is unavailable, the backend still creates a complete investigation using deterministic fallback analysis.

This prevents the demo from breaking during judging and keeps the release decision workflow usable.

The system has three important resilience layers:

1. Frontend fallback API URL for local development
2. Backend deterministic fallback if AI enrichment fails
3. Render health check endpoints for deployment stability

---

## Human-in-the-Loop Release Governance

SpecTrace does not automatically approve releases.

Every investigation ends with a Human Approval Gate where the reviewer can:

- Approve release
- Request changes
- Block release

This makes the AI output safer, reviewable, and practical for real engineering teams.

---

## Deployment Architecture

```text
User Browser
    ↓
Vercel
Next.js Web App
    ↓
Render
.NET API Backend
    ↓
Render
Python FastAPI AI Worker
    ↓
Fireworks AI Serverless Inference
```

Live URLs:

```text
Frontend:  https://spectrace-ai.vercel.app
API:       https://spectrace-api.onrender.com
AI Worker: https://spectrace-ai-worker.onrender.com
```

---

## Environment Variables

Frontend environment variable:

```text
NEXT_PUBLIC_API_BASE_URL=https://spectrace-api.onrender.com
```

Backend environment variables:

```text
ASPNETCORE_ENVIRONMENT=Production
AI_WORKER_BASE_URL=https://spectrace-ai-worker.onrender.com
```

AI worker environment variables:

```text
FIREWORKS_API_KEY=your_fireworks_key
FIREWORKS_MODEL=accounts/fireworks/models/kimi-k2p7-code
```

Secrets must never be committed to Git.

---

## Docker Strategy

The .NET API uses Docker for Render deployment.

Dockerfile path:

```text
apps/api/Dockerfile
```

Render settings:

```text
Root Directory: .
Docker Build Context Directory: .
Dockerfile Path: apps/api/Dockerfile
Health Check Path: /
```

The API container listens on:

```text
http://0.0.0.0:10000
```

---

## CORS Strategy

The .NET API allows both local development and deployed frontend access.

Allowed origins:

```text
http://localhost:3000
https://spectrace-ai.vercel.app
```

This allows the Vercel frontend to call the Render API safely.

---

## AMD Platform Direction

SpecTrace was built for the AMD Developer Hackathon: ACT II.

Current live runtime:

- Vercel frontend
- Render .NET API
- Render Python AI worker
- Fireworks AI serverless inference

AMD validation:

- AMD AI Notebook access was allocated during the hackathon.
- AMD runtime validation screenshots are stored in `docs/screenshots`.

Future AMD route:

- AMD Developer Cloud
- ROCm/GPU-backed inference
- Gemma-style model routing
- Screenshot evidence analysis
- Video-frame extraction
- Larger multimodal evidence-correlation workloads

This keeps the submission honest: the current product is live today, while the AMD GPU pathway is validated and ready for future acceleration.

---

## Security and Repository Safety

SpecTrace keeps secrets and generated files out of Git.

Ignored files include:

- `.env`
- `.env.*`
- Python virtual environments
- Next.js build output
- Node modules
- .NET `bin/` and `obj/`
- Uploaded runtime evidence

This keeps the repository clean and safe for public hackathon submission.

---

## Why This Architecture Works for the Hackathon

SpecTrace is designed to be:

- Complete enough to demo live
- Stable enough for judges to test
- Honest about current and future AI runtimes
- Modular enough to move from Fireworks AI to AMD ROCm/Gemma-style inference
- Practical enough for real engineering teams

The architecture separates product workflow from AI runtime. That means the release intelligence experience remains stable even as the AI execution backend evolves.