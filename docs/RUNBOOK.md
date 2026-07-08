# SpecTrace Runbook

This guide explains how to run SpecTrace locally for demo and judging.

---

## Requirements

Install:

- Node.js
- npm
- .NET SDK
- Python 3.13
- Git

---

## Environment Setup

Create this file:

```text
services/ai-worker/.env
```

Example:

```env
FIREWORKS_API_KEY=your_fireworks_api_key_here
FIREWORKS_MODEL=accounts/fireworks/models/kimi-k2p7-code
```

Never commit `.env`.

Use `.env.example` for safe public configuration examples.

---

## Terminal 1 — Run .NET API

```powershell
cd "C:\Users\farza\Desktop\All Hackathon\AMD Developer Hackathon Act 2\Code\spectrace-ai"
dotnet run --project apps/api
```

Expected API URL:

```text
http://localhost:5166
```

---

## Terminal 2 — Run Python AI Worker

```powershell
cd "C:\Users\farza\Desktop\All Hackathon\AMD Developer Hackathon Act 2\Code\spectrace-ai\services\ai-worker"
.\.venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --port 8000
```

Expected AI worker docs:

```text
http://localhost:8000/docs
```

---

## Terminal 3 — Run Web App

```powershell
cd "C:\Users\farza\Desktop\All Hackathon\AMD Developer Hackathon Act 2\Code\spectrace-ai\apps\web"
npm run dev
```

Expected app URL:

```text
http://localhost:3000
```

---

## Demo Workflow

1. Open the web app.
2. Upload an application log.
3. Fill the incident context.
4. Click `Create evidence investigation`.
5. Review:
   - Root-cause hypothesis
   - AI reasoning layer
   - Evidence timeline
   - Evidence graph
   - Generated engineering assets
   - Human approval gate

---

## AI Worker Health Check

Open:

```text
http://localhost:8000/docs
```

Then test:

```text
GET /health
```

Expected result:

```json
{
  "status": "ok",
  "service": "spectrace-ai-worker"
}
```

---

## Fallback Test

To test resilience:

1. Stop the AI worker with `CTRL + C`.
2. Keep the API and Web app running.
3. Create a new investigation.

Expected result:

```text
Provider: SpecTrace deterministic fallback
Mode: local-fallback
```

This proves the app remains usable even if remote AI is unavailable.

---

## Fireworks AI Test

With the AI worker running and a valid Fireworks API key, create a new investigation.

Expected result:

```text
Provider: Fireworks AI
Mode: remote
```

---

## Git Safety

The repository ignores:

- `.env`
- Python virtual environments
- .NET `bin/` and `obj/`
- Next.js build folders
- Uploaded runtime evidence logs

Before committing, run:

```powershell
git status
```

Do not commit secrets, generated build output, or uploaded runtime logs.

---

## Recommended Commit Commands

Run from the repository root:

```powershell
cd "C:\Users\farza\Desktop\All Hackathon\AMD Developer Hackathon Act 2\Code\spectrace-ai"
git add docs/ARCHITECTURE.md
git add docs/RUNBOOK.md
git status
git commit -m "Add architecture and runbook documentation"
git push
```

---

## Troubleshooting

### AI worker docs do not open

Make sure Terminal 2 is running:

```powershell
cd "C:\Users\farza\Desktop\All Hackathon\AMD Developer Hackathon Act 2\Code\spectrace-ai\services\ai-worker"
.\.venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --port 8000
```

### API does not start

Make sure no other process is using the API port. Stop the old API terminal with `CTRL + C`, then run:

```powershell
dotnet run --project apps/api
```

### Web app does not open

Make sure Terminal 3 is running:

```powershell
cd "C:\Users\farza\Desktop\All Hackathon\AMD Developer Hackathon Act 2\Code\spectrace-ai\apps\web"
npm run dev
```

### Fireworks model error

Use a model available to the current Fireworks account and serverless access.

Current safe example:

```env
FIREWORKS_MODEL=accounts/fireworks/models/kimi-k2p7-code
```

Do not create dedicated deployments if billing information is requested.
