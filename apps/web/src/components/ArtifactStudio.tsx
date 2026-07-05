"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clipboard,
  Download,
  FileCode2,
  FileText,
  ShieldCheck,
  X,
} from "lucide-react";

type GeneratedAsset = {
  type: string;
  title: string;
  contentPreview: string;
  status: string;
};

type EvidenceItem = {
  id: string;
  sourceType: string;
  sourceReference: string;
  summary: string;
  severity: string;
};

type Props = {
  asset: GeneratedAsset;
  analysisId: string;
  investigationTitle: string;
  rootCauseTitle: string;
  recommendation: string;
  evidence: EvidenceItem[];
  onClose: () => void;
};

function getArtifactIcon(type: string) {
  if (type === "Playwright Test") {
    return <FileCode2 size={18} />;
  }

  if (type === "GitHub Issue") {
    return <FileText size={18} />;
  }

  return <ShieldCheck size={18} />;
}

function getFileName(type: string) {
  if (type === "Playwright Test") {
    return "generated-regression-check.spec.ts";
  }

  if (type === "GitHub Issue") {
    return "evidence-linked-investigation.md";
  }

  return "release-safety-criteria.md";
}

export default function ArtifactStudio({
  asset,
  analysisId,
  investigationTitle,
  rootCauseTitle,
  recommendation,
  evidence,
  onClose,
}: Props) {
  const [copied, setCopied] = useState(false);

  const content = useMemo(() => {
    const evidenceReferences = evidence
      .map(
        (item) =>
          `- **${item.id} · ${item.sourceType}** — ${item.sourceReference}\n  ${item.summary}`
      )
      .join("\n");

    if (asset.type === "Playwright Test") {
      return `import { test, expect } from "@playwright/test";

test("${investigationTitle.toLowerCase().replaceAll('"', "")}", async ({ page }) => {
  await page.goto("/checkout");

  await page.getByLabel("Card number").fill("4242 4242 4242 4242");
  await page.getByRole("button", { name: /pay now/i }).click();

  // Simulate the current payment-service response contract.
  await page.route("**/payments/confirm", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        transactionId: "txn_spec_trace_001",
        status: "succeeded"
      })
    });
  });

  // Regression protection:
  // checkout must support transactionId and reach confirmation.
  await expect(
    page.getByRole("heading", { name: /order confirmed/i })
  ).toBeVisible();

  await expect(page.getByText(/processing payment/i)).not.toBeVisible();
});`;
    }

    if (asset.type === "GitHub Issue") {
      return `# ${investigationTitle}

## Severity
High — release safety and customer-impacting checkout regression.

## SpecTrace investigation
- **Trace ID:** ${analysisId}
- **Root-cause hypothesis:** ${rootCauseTitle}

## Customer impact
Customers may complete payment successfully but remain on the processing screen without receiving an order confirmation.

## Evidence
${evidenceReferences}

## Recommended action
${recommendation}

## Definition of done
- [ ] Support the current payment response contract.
- [ ] Add backward-compatible mapping where required.
- [ ] Add regression coverage for successful payment confirmation.
- [ ] Validate the API contract in CI.
- [ ] Confirm order confirmation is shown after a successful payment response.`;
    }

    return `# Release Safety Criteria

## Investigation
- **Trace ID:** ${analysisId}
- **Title:** ${investigationTitle}
- **Root cause:** ${rootCauseTitle}

## Required release checks
- [ ] The affected journey is reproducible before the fix.
- [ ] The root-cause hypothesis is validated against attached evidence.
- [ ] Successful payment responses transition the user to order confirmation.
- [ ] Legacy response fields are handled safely where compatibility is required.
- [ ] Regression coverage runs in CI.
- [ ] A reviewer approves the release decision.

## Linked evidence
${evidenceReferences}

## Recommended action
${recommendation}`;
  }, [
    analysisId,
    asset.type,
    evidence,
    investigationTitle,
    recommendation,
    rootCauseTitle,
  ]);

  async function copyContent() {
    await navigator.clipboard.writeText(content);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  function downloadContent() {
    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = getFileName(asset.type);
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020814]/85 p-4 backdrop-blur-md">
      <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-cyan-200/20 bg-[#071526] shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />

        <header className="flex items-start justify-between gap-5 border-b border-white/10 px-6 py-5 sm:px-8">
          <div className="flex gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
              {getArtifactIcon(asset.type)}
            </div>

            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-cyan-300">
                ARTIFACT STUDIO
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {asset.title}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Generated from traceable investigation evidence.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-slate-950/60 text-slate-300 transition hover:border-cyan-300/40 hover:text-white"
            aria-label="Close Artifact Studio"
          >
            <X size={18} />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[1fr_300px]">
          <section className="min-h-0 overflow-auto p-6 sm:p-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-200">
                {asset.type}
              </span>

              <span className="text-xs text-slate-500">
                {asset.status}
              </span>
            </div>

            <pre className="min-h-[420px] overflow-auto rounded-2xl border border-white/10 bg-[#020b17] p-5 font-mono text-xs leading-6 text-slate-200 sm:text-sm">
              <code>{content}</code>
            </pre>
          </section>

          <aside className="border-t border-white/10 bg-gradient-to-b from-cyan-950/20 to-slate-950/30 p-6 lg:border-l lg:border-t-0">
            <p className="text-xs font-bold tracking-[0.15em] text-cyan-300">
              INVESTIGATION CONTEXT
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <span className="block text-xs text-slate-500">Trace ID</span>
                <strong className="mt-1 block font-mono text-xs text-cyan-200">
                  {analysisId}
                </strong>
              </div>

              <div>
                <span className="block text-xs text-slate-500">
                  Evidence sources
                </span>
                <strong className="mt-1 block text-2xl text-white">
                  {evidence.length}
                </strong>
              </div>

              <div className="rounded-xl border border-emerald-300/15 bg-emerald-300/5 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
                  <CheckCircle2 size={15} />
                  Evidence-linked draft
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  This artifact is generated from the uploaded evidence and
                  current investigation context.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <footer className="flex flex-col gap-3 border-t border-white/10 bg-slate-950/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-xs text-slate-500">
            Review and validate before exporting to your engineering workflow.
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={copyContent}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm font-bold text-slate-200 transition hover:border-cyan-300/35 hover:text-white"
            >
              <Clipboard size={16} />
              {copied ? "Copied" : "Copy"}
            </button>

            <button
              type="button"
              onClick={downloadContent}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-sky-400 px-4 py-2.5 text-sm font-extrabold text-slate-950 shadow-[0_10px_28px_rgba(34,211,238,0.22)] transition hover:brightness-110"
            >
              <Download size={16} />
              Download draft
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}