# SpecTrace — Demo Script

## Video Goal

Show that SpecTrace turns fragmented release evidence into a traceable, AI-assisted release decision.

Target length: 2 to 3 minutes.

---

## 1. Opening

“SpecTrace is an Evidence Intelligence Platform for engineering teams. It helps teams find the truth behind every release by connecting logs, incident context, AI reasoning, generated QA assets, and human approval into one traceable workflow.”

---

## 2. Problem

“Release teams often make decisions with fragmented evidence. Logs, screenshots, QA notes, and product context are separated. AI summaries can help, but they are often not linked to proof. SpecTrace solves this by keeping every conclusion connected to evidence.”

---

## 3. Upload Evidence

Show the workspace.

Upload the log file:

`payment-contract-mismatch.log`

Explain:

“This log represents a production checkout issue after the latest release.”

---

## 4. Add Incident Context

Use:

Title:

`Checkout confirmation fails after payment`

Description:

`Customers complete payment successfully, but remain on the processing screen and do not receive an order confirmation after the latest release.`

Release version:

`2026.07.05.1`

Explain:

“We provide the incident context so SpecTrace can connect the technical evidence to product impact.”

---

## 5. Create Investigation

Click:

`Create evidence investigation`

Explain:

“SpecTrace ingests the evidence, extracts signals, creates a root-cause hypothesis, and sends the investigation to the AI reasoning layer.”

---

## 6. Show Investigation Result

Point to:

- Release exposure
- Root-cause confidence
- Connected sources
- Generated outputs

Explain:

“The system identifies a payment response-contract mismatch. The frontend expects a legacy paymentIntentId field while the service now returns transactionId.”

---

## 7. Show AI Reasoning Layer

Point to:

- Provider: Fireworks AI
- Mode: Remote
- Reviewer summary
- Release decision rationale
- Engineering action plan

Explain:

“The AI worker enriches the investigation with a reviewer summary, engineering recommendation, and release decision rationale.”

---

## 8. Show Evidence Timeline

Explain:

“The timeline shows how the investigation progressed: investigation created, evidence ingested, and technical signals detected.”

---

## 9. Show Evidence Graph

Explain:

“Every conclusion is linked to proof. This is important because release decisions must be explainable and reviewable.”

---

## 10. Show Generated Engineering Assets

Open each draft briefly:

- Playwright regression test
- GitHub issue
- Acceptance criteria

Explain:

“SpecTrace does not stop at analysis. It generates execution-ready assets for engineering and QA teams.”

---

## 11. Show Human Approval Gate

Click:

`Review investigation`

Explain:

“A human reviewer can approve the release, request changes, or block the release. This keeps AI assistance controlled and safe.”

---

## 12. AMD / AI Infrastructure

Show AMD Platform Integration.

Explain:

“SpecTrace includes a modular AI worker prepared for AMD and Gemma-style inference. In this demo, the remote enrichment uses Fireworks AI serverless for a billing-safe workflow. The architecture is ready to move toward AMD Developer Cloud and ROCm-powered inference.”

---

## 13. Closing

“SpecTrace turns product evidence into release decisions. It helps engineering teams ship faster, safer, and with proof.”