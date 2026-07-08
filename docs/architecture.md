# SpecTrace Architecture

SpecTrace is an Evidence Intelligence Platform that turns fragmented product evidence into traceable release decisions.

The system is built as a modular full-stack application with three main services:

1. Next.js Web App
2. .NET API Backend
3. Python FastAPI AI Worker

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

---

## Backend API

Path:

```text
apps/api
```

Technology:

- .NET 10 API
- C#

Responsibilities:

- Accept uploaded evidence
- Store runtime evidence references locally
- Create investigation reports
- Analyze log evidence
- Call the AI worker
- Generate deterministic fallback reasoning if the AI worker is unavailable
- Return a complete traceable analysis report to the frontend

---

## AI Worker

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

---

## AI Runtime Strategy

SpecTrace supports a modular AI runtime strategy.

Current demo mode:

```text
Fireworks AI serverless inference
```

Fallback mode:

```text
SpecTrace deterministic local fallback
```

Future AMD-ready mode:

```text
AMD Developer Cloud / ROCm / Gemma-style inference
```

The architecture is designed so the AI worker can route evidence reasoning to different model runtimes without changing the core product workflow.

---

## Resilience

SpecTrace is designed to remain demo-safe.

If the AI worker or remote AI provider is unavailable, the backend still creates a complete investigation using deterministic fallback analysis.

This prevents the demo from breaking during judging and keeps the release decision workflow usable.

---

## Human-in-the-Loop Release Governance

SpecTrace does not automatically approve releases.

Every investigation ends with a Human Approval Gate where the reviewer can:

- Approve release
- Request changes
- Block release

This makes the AI output safer, reviewable, and practical for real engineering teams.

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
