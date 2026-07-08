# LabLab AI Submission Text — SpecTrace AI

## Project Name

SpecTrace AI

---

## One-Line Pitch

SpecTrace turns fragmented product evidence into traceable AI-powered release decisions, generated QA assets, and human approval workflows.

---

## Short Description

SpecTrace is an evidence intelligence workspace for engineering, QA, SRE, and product teams.

It helps teams decide whether a release is safe by connecting logs, incident context, AI reasoning, generated test assets, and human approval into one traceable workflow.

The current demo investigates a checkout regression where customers complete payment successfully but remain stuck on the processing screen without an order confirmation. SpecTrace detects a payment response-contract mismatch, enriches the investigation with Fireworks AI, generates engineering actions, and routes the result through a human release decision gate.

---

## Track

Unicorn Track

---

## Challenge Fit

The Unicorn Track asks builders to create product- or startup-oriented AI applications using AMD technologies, Fireworks AI, AMD Developer Cloud, ROCm, and open-source frameworks.

SpecTrace is designed as a startup-style product for release intelligence. It combines a polished AI product experience with a practical engineering workflow:

```text
Evidence upload
→ technical signal extraction
→ AI reasoning
→ generated engineering assets
→ human release decision
```

The current implementation uses Fireworks AI serverless inference safely and includes an AMD/Gemma-ready architecture for future AMD Developer Cloud / ROCm execution when cloud credits are available.

---

## Problem

Release teams often make decisions with fragmented evidence:

- Logs are in one place.
- QA notes are in another.
- Product context is in tickets.
- Screenshots and videos are shared manually.
- AI summaries are often disconnected from proof.

This makes it hard to answer:

- What actually happened?
- What evidence supports the conclusion?
- What should engineering do next?
- Should the release be approved, changed, or blocked?

SpecTrace solves this by creating evidence-linked release investigations.

---

## Solution

SpecTrace creates a structured investigation from uploaded product evidence.

It provides:

- Evidence upload
- Incident context capture
- Deterministic technical signal extraction
- Root-cause hypothesis
- AI reviewer summary
- Engineering action plan
- Release decision rationale
- Evidence timeline
- Evidence graph
- Generated Playwright test draft
- Generated GitHub issue draft
- Generated acceptance criteria
- Human approval gate

This transforms raw incident evidence into an engineering-ready release decision.

---

## Demo Scenario

The demo uses a checkout incident:

```text
Customers complete payment successfully,
but remain on the processing screen
and do not receive an order confirmation.
```

The uploaded log contains signals showing that:

```text
The frontend expects paymentIntentId,
but the payment service returns transactionId.
```

SpecTrace detects this as a payment response-contract mismatch and recommends blocking release until the mapping, contract validation, and regression tests are fixed.

---

## How It Works

1. The user uploads evidence and fills the incident context.
2. The Next.js frontend sends the investigation to the .NET API.
3. The .NET API stores evidence references and extracts deterministic technical signals.
4. The API calls a Python FastAPI AI worker.
5. The AI worker calls Fireworks AI serverless inference.
6. The AI worker returns structured JSON:
   - Reviewer summary
   - Engineering recommendation
   - Release decision rationale
7. The frontend renders the complete investigation.
8. The user can open generated engineering assets.
9. A human reviewer approves, requests changes, or blocks the release.

---

## AI / AMD / Fireworks Use

Current live demo:

- Fireworks AI serverless inference
- Python FastAPI AI worker
- OpenAI-compatible Fireworks API
- Safe deterministic fallback when remote AI is unavailable

AMD-ready architecture:

- Modular AI worker designed for AMD Developer Cloud / ROCm execution
- Gemma-style inference path prepared for future AMD/Gemma deployment
- UI includes AMD Platform Integration and Judge Mode sections
- Future routing can support Fireworks serverless, AMD GPU inference, and deterministic fallback

Important billing-safe note:

The current demo does not require paid Fireworks dedicated deployment or a payment method. It uses serverless inference through available Fireworks credits.

---

## Technical Stack

- Next.js
- React
- TypeScript
- .NET API
- C#
- Python
- FastAPI
- Fireworks AI
- OpenAI-compatible API client
- Local deterministic evidence analyzer
- Human-in-the-loop release workflow

---

## Key Features

### Evidence Intelligence

SpecTrace analyzes uploaded logs and incident context to identify release-risk signals.

### AI Reasoning Layer

Remote AI enrichment generates a reviewer summary, engineering action plan, and release decision rationale.

### Engineering Assets

SpecTrace generates:

- Playwright regression test draft
- GitHub issue draft
- Acceptance criteria draft

### Human Approval Gate

The reviewer can:

- Approve release
- Request changes
- Block release

### Fallback Safety

If the AI worker or remote AI provider is unavailable, SpecTrace still creates a complete investigation using deterministic fallback reasoning.

---

## Judging Criteria Alignment

### Creativity and Originality

SpecTrace is not another generic AI incident summarizer. It creates traceable release investigations where conclusions are linked to evidence and converted into engineering actions.

### Product / Market Potential

SpecTrace targets real engineering teams that need safer releases:

- QA teams
- Release managers
- SRE teams
- Engineering managers
- Product operations teams
- E-commerce and fintech teams

Potential business model:

- SaaS subscription per engineering team
- Enterprise tier for private evidence retention, SSO, audit trails, and CI/CD integrations
- Usage-based AI evidence analysis

### Completeness

The prototype is functional end-to-end:

- Web app
- API backend
- AI worker
- Fireworks AI integration
- Fallback safety
- Evidence analysis
- Generated artifacts
- Human approval workflow
- Documentation
- Judge Mode section

### Use of AMD Platforms

SpecTrace is designed for AMD AI workflows. The current demo uses Fireworks AI serverless inference safely, and the architecture is prepared for AMD Developer Cloud / ROCm / Gemma-style execution when credits are available.

---

## Why SpecTrace Is Different

Most tools stop at alerts or AI summaries.

SpecTrace goes further:

```text
Evidence
→ reasoning
→ engineering actions
→ approval decision
```

It helps teams not only understand an incident, but decide what to do next and preserve a traceable record of the decision.

---

## Demo Video Script Summary

1. Show the problem: fragmented release evidence.
2. Upload the checkout log.
3. Create the evidence investigation.
4. Show the root-cause hypothesis.
5. Show Fireworks AI reasoning.
6. Show the engineering action plan.
7. Open the generated Playwright test / GitHub issue / acceptance criteria.
8. Use the Human Approval Gate to block the release.
9. Show the AMD Platform Integration and Judge Mode sections.

---

## Project Links

GitHub Repository:

```text
PASTE_GITHUB_REPO_URL_HERE
```

Live App:

```text
PASTE_LIVE_APP_URL_HERE
```

Demo Video:

```text
PASTE_DEMO_VIDEO_URL_HERE
```

Slides:

```text
PASTE_SLIDES_URL_HERE
```

---

## Final Pitch

SpecTrace helps engineering teams find the truth behind every release.

It turns fragmented evidence into traceable AI-powered investigations, generates the assets teams need to fix and validate issues, and keeps humans in control of release decisions.

It is a practical AI product for safer software delivery.
