"use client";

import { MouseEvent, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Command,
  FileSearch,
  Layers3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import EvidenceUploadPanel from "@/components/EvidenceUploadPanel";
import ArtifactStudio from "@/components/ArtifactStudio";
import ReviewConsole from "@/components/ReviewConsole";

type TimelineEvent = {
  timestamp: string;
  title: string;
  description: string;
  severity: string;
};

type EvidenceItem = {
  id: string;
  sourceType: string;
  sourceReference: string;
  summary: string;
  severity: string;
};

type GeneratedAsset = {
  type: string;
  title: string;
  contentPreview: string;
  status: string;
};

type AnalysisReport = {
  analysisId: string;
  title: string;
  status: string;
  riskScore: number;
  riskLevel: string;
  executiveSummary: string;
  rootCause: {
    title: string;
    description: string;
    confidence: number;
    recommendation: string;
  };
  timeline: TimelineEvent[];
  evidence: EvidenceItem[];
  generatedAssets: GeneratedAsset[];
  humanApproval: {
    required: boolean;
    reason: string;
    status: string;
  };
  amdProcessing: {
    status: string;
    runtime: string;
    pipeline: string;
  };
  aiEnrichment: {
    available: boolean;
    provider: string;
    mode: string;
    reviewerSummary: string;
    engineeringRecommendation: string;
    releaseDecisionRationale: string;
  };
};

function severityClass(severity: string) {
  return severity.toLowerCase().replaceAll(" ", "-");
}

export default function Home() {
  const [analysis, setAnalysis] = useState<AnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAsset, setSelectedAsset] =
    useState<GeneratedAsset | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  function scrollToSection(
    event: MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) {
    event.preventDefault();

    const target = document.getElementById(sectionId);

    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function loadDemoAnalysis() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5166/api/analyses/demo", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("The SpecTrace API could not create the demo analysis.");
      }

      const data = (await response.json()) as AnalysisReport;
      setAnalysis(data);
    } catch {
      setError(
        "Unable to reach the SpecTrace API. Confirm that the .NET API is running on port 5166."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="spectrace-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="grid-overlay" />

      <aside className="command-rail">
        <div className="rail-brand">
          <div className="rail-logo">
            <Command size={19} strokeWidth={2.8} />
          </div>

          <div className="rail-brand-copy">
            <strong>SpecTrace</strong>
            <span>Evidence OS</span>
          </div>
        </div>

        <nav className="rail-navigation" aria-label="SpecTrace sections">
          <a
            className="rail-link rail-link-active"
            href="#workspace"
            onClick={(event) => scrollToSection(event, "workspace")}
          >
            <Layers3 size={17} />
            <span>Workspace</span>
          </a>

          <a
            className="rail-link"
            href="#evidence-workspace"
            onClick={(event) => scrollToSection(event, "evidence-workspace")}
          >
            <FileSearch size={17} />
            <span>Evidence</span>
          </a>

          <a
            className="rail-link"
            href="#assets"
            onClick={(event) => scrollToSection(event, "assets")}
          >
            <Sparkles size={17} />
            <span>Assets</span>
          </a>

          <a
            className="rail-link"
            href="#amd"
            onClick={(event) => scrollToSection(event, "amd")}
          >
            <Activity size={17} />
            <span>AMD Runtime</span>
          </a>
        </nav>

        <div className="rail-runtime">
          <div className="runtime-pulse">
            <span />
            AMD PIPELINE ONLINE
          </div>

          <p>Multimodal evidence intelligence for engineering teams.</p>
        </div>
      </aside>

      <section className="experience-stage">
        <header className="experience-topbar">
          <div className="topbar-context">
            <span className="topbar-status-dot" />
            <span>Evidence Intelligence Platform</span>
          </div>

          <div className="topbar-actions">
            <span className="topbar-live">
              <Activity size={14} />
              Live workspace
            </span>

            <button
              className="topbar-demo-button"
              onClick={loadDemoAnalysis}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Launch demo"}
              <ArrowUpRight size={16} />
            </button>
          </div>
        </header>

        <section className="hero-command" id="workspace">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span />
              PRODUCT EVIDENCE, MADE ACTIONABLE
            </div>

            <h1>
              Find the truth
              <br />
              <em>behind every release.</em>
            </h1>

            <p>
              SpecTrace turns fragmented product evidence into a single,
              evidence-linked investigation your engineering team can trust.
            </p>

            <div className="hero-signals">
              <div>
                <strong>01</strong>
                <span>Attach evidence</span>
              </div>

              <div>
                <strong>02</strong>
                <span>Trace signals</span>
              </div>

              <div>
                <strong>03</strong>
                <span>Ship safely</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />

            <div className="visual-core">
              <div className="visual-core-inner">
                <ShieldCheck size={54} strokeWidth={1.35} />
              </div>
            </div>

            <div className="visual-signal-card signal-card-top">
              <span className="signal-dot signal-dot-cyan" />
              Evidence graph initialized
            </div>

            <div className="visual-signal-card signal-card-bottom">
              <span className="signal-dot signal-dot-green" />
              Traceability enabled
            </div>

            <div className="visual-metric visual-metric-left">
              <span>Signal confidence</span>
              <strong>94.8%</strong>
            </div>

            <div className="visual-metric visual-metric-right">
              <span>Evidence sources</span>
              <strong>∞</strong>
            </div>
          </div>
        </section>

        <section id="evidence-workspace" className="evidence-workspace-anchor">
          <EvidenceUploadPanel
            onInvestigationCreated={(createdAnalysis) => {
              const incoming = createdAnalysis as AnalysisReport;

              setAnalysis({
                ...incoming,
                aiEnrichment: {
                  available: incoming.aiEnrichment?.available ?? false,
                  provider:
                    incoming.aiEnrichment?.provider ?? "AI enrichment pending",
                  mode: incoming.aiEnrichment?.mode ?? "deterministic",
                  reviewerSummary:
                    incoming.aiEnrichment?.reviewerSummary ??
                    "SpecTrace created the investigation and is preparing the AI reasoning layer.",
                  engineeringRecommendation:
                    incoming.aiEnrichment?.engineeringRecommendation ??
                    "Review the extracted evidence, validate the root-cause hypothesis, and perform regression checks before changing the release decision.",
                  releaseDecisionRationale:
                    incoming.aiEnrichment?.releaseDecisionRationale ??
                    "A reviewer should validate the extracted evidence before changing the release status.",
                },
              });

              window.setTimeout(() => {
                document
                  .getElementById("analysis-command-center")
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
              }, 150);
            }}
          />
        </section>

        {isLoading && (
          <section className="cinematic-loading">
            <div className="cinematic-loader">
              <span />
              <span />
              <span />
            </div>

            <p className="hero-kicker">
              <span />
              BUILDING INVESTIGATION GRAPH
            </p>

            <h2>Correlating every signal.</h2>

            <p>
              Video frames, logs, screenshots, and customer evidence are entering
              the SpecTrace reasoning pipeline.
            </p>
          </section>
        )}

        {error && <div className="experience-error">{error}</div>}

        {analysis && (
          <section
            id="analysis-command-center"
            className="analysis-command-center"
          >
            <div className="analysis-intro">
              <div>
                <p className="hero-kicker">
                  <span />
                  INVESTIGATION COMPLETE
                </p>

                <h2>{analysis.title}</h2>

                <p>{analysis.executiveSummary}</p>
              </div>

              <div className="analysis-id-block">
                <span>TRACE ID</span>
                <strong>{analysis.analysisId}</strong>
                <small>{analysis.status}</small>
              </div>
            </div>

            <div className="analysis-scoreboard">
              <article className="score-card score-card-danger">
                <span>Release exposure</span>
                <strong>{analysis.riskScore}</strong>
                <small>{analysis.riskLevel} priority</small>
              </article>

              <article className="score-card">
                <span>Root-cause confidence</span>
                <strong>{analysis.rootCause.confidence}%</strong>
                <small>Evidence-linked conclusion</small>
              </article>

              <article className="score-card">
                <span>Connected sources</span>
                <strong>{analysis.evidence.length}</strong>
                <small>Signals in the evidence graph</small>
              </article>

              <article className="score-card score-card-cyan">
                <span>Generated outputs</span>
                <strong>{analysis.generatedAssets.length}</strong>
                <small>Ready for engineering review</small>
              </article>
            </div>

            <div className="analysis-layout">
              <section className="command-card command-card-root">
                <div className="command-card-label">
                  <Sparkles size={15} />
                  ROOT-CAUSE HYPOTHESIS
                </div>

                <h3>{analysis.rootCause.title}</h3>

                <p>{analysis.rootCause.description}</p>

                <div className="command-recommendation">
                  <span>RECOMMENDED ACTION</span>
                  <strong>{analysis.rootCause.recommendation}</strong>
                </div>
              </section>

              <section className="panel ai-reasoning-panel">
                <div className="section-heading-row">
                  <div>
                    <p className="hero-kicker">
                      <span />
                      AI REASONING LAYER
                    </p>

                    <h2>From detected signals to a release decision.</h2>
                  </div>

                  <div className="ai-provider-pill">
                    <span
                      className={
                        analysis.aiEnrichment.available ? "pulse-dot" : ""
                      }
                    />
                    {analysis.aiEnrichment.provider}
                  </div>
                </div>

                <div className="ai-reasoning-grid">
                  <article className="ai-reasoning-card">
                    <p className="card-label">REVIEWER SUMMARY</p>

                    <p className="ai-reasoning-copy">
                      {analysis.aiEnrichment.reviewerSummary}
                    </p>
                  </article>

                  <article className="ai-reasoning-card ai-rationale-card">
                    <p className="card-label">RELEASE DECISION RATIONALE</p>

                    <p className="ai-reasoning-copy">
                      {analysis.aiEnrichment.releaseDecisionRationale}
                    </p>

                    <div className="ai-runtime-meta">
                      <span>Mode</span>
                      <strong>{analysis.aiEnrichment.mode}</strong>
                    </div>
                  </article>
                </div>

                {analysis.aiEnrichment.available &&
                  analysis.aiEnrichment.engineeringRecommendation && (
                    <section className="ai-action-plan">
                      <div className="ai-action-plan-topline">
                        <div>
                          <p className="section-kicker">
                            <span>✦</span> ENGINEERING ACTION PLAN
                          </p>

                          <h3>From AI reasoning to a safe release.</h3>
                        </div>

                        <div className="ai-action-provider">
                          <span className="ai-action-status-dot" />
                          {analysis.aiEnrichment.provider} ·{" "}
                          {analysis.aiEnrichment.mode}
                        </div>
                      </div>

                      <div className="ai-action-plan-body">
                        <div className="ai-action-icon">↗</div>

                        <div>
                          <p className="ai-action-label">
                            RECOMMENDED ENGINEERING ACTIONS
                          </p>

                          <p className="ai-action-copy">
                            {analysis.aiEnrichment.engineeringRecommendation}
                          </p>
                        </div>
                      </div>

                      <div className="ai-action-footer">
                        <span>Evidence-linked recommendation</span>
                        <span>
                          Human validation required before release
                        </span>
                      </div>
                    </section>
                  )}
              </section>

              <section className="command-card command-card-timeline">
                <div className="command-card-label">
                  <Activity size={15} />
                  EVIDENCE TIMELINE
                </div>

                <div className="modern-timeline">
                  {analysis.timeline.map((event) => (
                    <article
                      className="modern-timeline-item"
                      key={event.timestamp}
                    >
                      <span
                        className={`modern-timeline-node ${severityClass(
                          event.severity
                        )}`}
                      />

                      <div className="modern-timeline-time">
                        {event.timestamp}
                      </div>

                      <div>
                        <h4>{event.title}</h4>
                        <p>{event.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <section
              className="command-card evidence-command-card"
              id="evidence"
            >
              <div className="command-card-header">
                <div>
                  <div className="command-card-label">
                    <FileSearch size={15} />
                    EVIDENCE GRAPH
                  </div>

                  <h3>Every conclusion is linked to proof.</h3>
                </div>

                <span className="trace-verified">
                  <ShieldCheck size={15} />
                  Traceable sources
                </span>
              </div>

              <div className="modern-evidence-grid">
                {analysis.evidence.map((item) => (
                  <article className="modern-evidence-item" key={item.id}>
                    <div className="evidence-item-topline">
                      <span className="evidence-source-icon">
                        {item.sourceType.charAt(0)}
                      </span>

                      <span
                        className={`evidence-severity ${severityClass(
                          item.severity
                        )}`}
                      >
                        {item.severity}
                      </span>
                    </div>

                    <span className="evidence-source-type">
                      {item.sourceType}
                    </span>

                    <h4>{item.sourceReference}</h4>

                    <p>{item.summary}</p>

                    <span className="evidence-trace-id">{item.id}</span>
                  </article>
                ))}
              </div>
            </section>

            <section className="command-card assets-command-card" id="assets">
              <div className="command-card-header">
                <div>
                  <div className="command-card-label">
                    <Sparkles size={15} />
                    GENERATED ENGINEERING ASSETS
                  </div>

                  <h3>From evidence to execution.</h3>
                </div>
              </div>

              <div className="modern-assets-grid">
                {analysis.generatedAssets.map((asset) => (
                  <article className="modern-asset-item" key={asset.title}>
                    <span>{asset.type}</span>

                    <h4>{asset.title}</h4>

                    <p>{asset.contentPreview}</p>

                    <button
                      type="button"
                      onClick={() => setSelectedAsset(asset)}
                    >
                      Open draft <ArrowUpRight size={14} />
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <section className="judge-mode-section">
              <div className="section-heading-row">
                <p className="section-eyebrow">— JUDGE MODE</p>
                <span className="judge-pill">Unicorn Track Alignment</span>
              </div>

              <div className="judge-mode-header">
                <div>
                  <h2>Why SpecTrace matters.</h2>
                  <p>
                    SpecTrace is not another generic AI incident summary. It is an
                    evidence-linked release intelligence workflow that connects product
                    evidence, AI reasoning, generated engineering assets, and human approval
                    into one traceable decision.
                  </p>
                </div>
              </div>

              <div className="judge-grid">
                <article className="judge-card">
                  <span className="judge-index">01</span>
                  <h3>Creativity and Originality</h3>
                  <p>
                    SpecTrace keeps every AI conclusion connected to proof. Instead of
                    producing a disconnected summary, it builds a traceable investigation
                    from uploaded evidence to release decision.
                  </p>
                </article>

                <article className="judge-card">
                  <span className="judge-index">02</span>
                  <h3>Product / Market Potential</h3>
                  <p>
                    Engineering, QA, SRE, and product teams need a trusted way to decide if a
                    release is safe. SpecTrace can become a release intelligence layer for
                    teams shipping high-impact software.
                  </p>
                </article>

                <article className="judge-card">
                  <span className="judge-index">03</span>
                  <h3>Completeness</h3>
                  <p>
                    The current workflow is end-to-end: upload evidence, create an
                    investigation, detect root cause, enrich with AI, generate QA assets, and
                    require a human release decision.
                  </p>
                </article>

                <article className="judge-card judge-card-amd">
                  <span className="judge-index">04</span>
                  <h3>Use of AMD Platforms</h3>
                  <p>
                    The AI worker is designed for AMD/Gemma-style inference and future
                    ROCm-powered execution. The current demo uses Fireworks AI serverless as
                    a billing-safe remote runtime while preserving an AMD-ready architecture.
                  </p>
                </article>
              </div>
            </section>

            <section className="rt-strategy-section">
              <div className="rt-strategy-header">
                <div>
                  <p className="rt-eyebrow">— AI ROUTING STRATEGY</p>
                  <h2>Runtime-aware evidence reasoning.</h2>
                  <p>
                    SpecTrace separates the product workflow from the AI runtime, so the
                    investigation pipeline stays resilient today and can move toward
                    AMD/Gemma-style acceleration as infrastructure access becomes available.
                  </p>
                </div>

                <span className="rt-header-pill">Demo-safe routing</span>
              </div>

              <div className="rt-route-grid">
                <article className="rt-route-card rt-route-live">
                  <div className="rt-card-top">
                    <span className="rt-number">01</span>
                    <span className="rt-status">Active now</span>
                  </div>

                  <h3>Fireworks AI serverless route</h3>

                  <p>
                    Uploaded log evidence and incident context are enriched through the
                    Python AI worker using Fireworks AI serverless inference.
                  </p>

                  <div className="rt-flow">
                    <span>Log evidence</span>
                    <strong>→</strong>
                    <span>FastAPI worker</span>
                    <strong>→</strong>
                    <span>Fireworks AI</span>
                    <strong>→</strong>
                    <span>Reviewer summary</span>
                  </div>
                </article>

                <article className="rt-route-card rt-route-fallback">
                  <div className="rt-card-top">
                    <span className="rt-number">02</span>
                    <span className="rt-status">Fallback-safe</span>
                  </div>

                  <h3>Deterministic local route</h3>

                  <p>
                    If the AI worker or remote provider is unavailable, the .NET backend
                    still completes the investigation using deterministic evidence analysis.
                  </p>

                  <div className="rt-flow">
                    <span>Evidence signals</span>
                    <strong>→</strong>
                    <span>.NET analyzer</span>
                    <strong>→</strong>
                    <span>Local fallback</span>
                    <strong>→</strong>
                    <span>Release decision</span>
                  </div>
                </article>

                <article className="rt-route-card rt-route-amd">
                  <div className="rt-card-top">
                    <span className="rt-number">03</span>
                    <span className="rt-status">AMD-ready</span>
                  </div>

                  <h3>Future AMD / ROCm route</h3>

                  <p>
                    The AI worker architecture is prepared for AMD Developer Cloud,
                    ROCm-powered execution, and Gemma-style inference when credits and
                    runtime access are available.
                  </p>

                  <div className="rt-flow">
                    <span>Multimodal evidence</span>
                    <strong>→</strong>
                    <span>AMD GPU / ROCm</span>
                    <strong>→</strong>
                    <span>Gemma-ready reasoning</span>
                  </div>
                </article>
              </div>
            </section>

            <section className="eval-scenarios-section">
              <div className="eval-scenarios-header">
                <div>
                  <p className="eval-eyebrow">— EVALUATION SCENARIOS</p>
                  <h2>Built for more than one demo.</h2>
                  <p>
                    SpecTrace is designed as a reusable release intelligence workflow. The
                    checkout incident is the live demo, but the same evidence pipeline can
                    support screenshots, videos, logs, API traces, and multi-source release
                    investigations.
                  </p>
                </div>

                <span className="eval-header-pill">Product-scale workflow</span>
              </div>

              <div className="eval-scenarios-grid">
                <article className="eval-scenario-card eval-scenario-live">
                  <div className="eval-scenario-top">
                    <span className="eval-scenario-number">01</span>
                    <span className="eval-scenario-status">Live demo</span>
                  </div>

                  <h3>Checkout payment confirmation regression</h3>

                  <p>
                    Customers complete payment successfully, but remain stuck on the
                    processing screen without an order confirmation.
                  </p>

                  <ul>
                    <li>Application log evidence</li>
                    <li>Payment response-contract mismatch</li>
                    <li>Release-blocking recommendation</li>
                  </ul>
                </article>

                <article className="eval-scenario-card">
                  <div className="eval-scenario-top">
                    <span className="eval-scenario-number">02</span>
                    <span className="eval-scenario-status">Next evidence type</span>
                  </div>

                  <h3>Screenshot UI error investigation</h3>

                  <p>
                    A screenshot can capture the exact product state, visible error message,
                    broken layout, or missing confirmation step after a release.
                  </p>

                  <ul>
                    <li>UI-state evidence</li>
                    <li>Visual failure context</li>
                    <li>QA reproduction notes</li>
                  </ul>
                </article>

                <article className="eval-scenario-card">
                  <div className="eval-scenario-top">
                    <span className="eval-scenario-number">03</span>
                    <span className="eval-scenario-status">Multimodal-ready</span>
                  </div>

                  <h3>Video journey failure detection</h3>

                  <p>
                    A screen recording can show where the customer journey breaks, which
                    interaction happened before the failure, and what state never completed.
                  </p>

                  <ul>
                    <li>Frame-by-frame journey review</li>
                    <li>Interaction timeline</li>
                    <li>Customer-impact evidence</li>
                  </ul>
                </article>

                <article className="eval-scenario-card eval-scenario-amd">
                  <div className="eval-scenario-top">
                    <span className="eval-scenario-number">04</span>
                    <span className="eval-scenario-status">Future scale</span>
                  </div>

                  <h3>Multi-source release evidence correlation</h3>

                  <p>
                    SpecTrace can correlate logs, screenshots, videos, API traces, and
                    support tickets into one explainable release decision.
                  </p>

                  <ul>
                    <li>Cross-source evidence graph</li>
                    <li>AI-assisted reasoning</li>
                    <li>Human approval audit trail</li>
                  </ul>
                </article>
              </div>
            </section>

            <section className="human-review-stage">
              <div>
                <p className="hero-kicker">
                  <span />
                  HUMAN APPROVAL GATE
                </p>

                <h3>{analysis.humanApproval.status}</h3>

                <p>{analysis.humanApproval.reason}</p>
              </div>

              <button type="button" onClick={() => setIsReviewOpen(true)}>
                Review investigation
                <ArrowUpRight size={17} />
              </button>
            </section>

            <section className="amd-runtime-stage" id="amd">
              <div className="amd-runtime-mark">
                <span>AMD</span>
                <small>ROCm / GPU Runtime</small>
              </div>

              <div>
                <p className="hero-kicker">
                  <span />
                  AMD PLATFORM INTEGRATION
                </p>

                <h3>{analysis.amdProcessing.status}</h3>

                <p>{analysis.amdProcessing.pipeline}</p>

                <small>{analysis.amdProcessing.runtime}</small>
              </div>
            </section>
            <div className="bottom-scroll-spacer" />
          </section>
        )}
      </section>

      {selectedAsset && analysis && (
        <ArtifactStudio
          asset={selectedAsset}
          analysisId={analysis.analysisId}
          investigationTitle={analysis.title}
          rootCauseTitle={analysis.rootCause.title}
          recommendation={analysis.rootCause.recommendation}
          evidence={analysis.evidence}
          onClose={() => setSelectedAsset(null)}
        />
      )}

      {isReviewOpen && analysis && (
        <ReviewConsole
          analysisId={analysis.analysisId}
          investigationTitle={analysis.title}
          riskScore={analysis.riskScore}
          rootCauseTitle={analysis.rootCause.title}
          onClose={() => setIsReviewOpen(false)}
          onDecision={(decision, note) => {
            const nextStatus =
              decision === "approve"
                ? "Approved for release"
                : decision === "block"
                  ? "Release blocked"
                  : "Changes requested";

            const nextReason =
              note ||
              (decision === "approve"
                ? "A reviewer approved the release after validating the current evidence."
                : decision === "block"
                  ? "A reviewer blocked the release because the current evidence indicates unacceptable risk."
                  : "A reviewer requested corrective changes before release approval.");

            setAnalysis((current) =>
              current
                ? {
                    ...current,
                    status: nextStatus,
                    humanApproval: {
                      ...current.humanApproval,
                      status: nextStatus,
                      reason: nextReason,
                    },
                  }
                : current
            );

            setIsReviewOpen(false);
          }}
        />
      )}
    </main>
  );
}