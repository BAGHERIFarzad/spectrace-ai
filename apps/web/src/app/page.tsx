"use client";

import { useState } from "react";
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
};

function severityClass(severity: string) {
  return severity.toLowerCase().replaceAll(" ", "-");
}

export default function Home() {
  const [analysis, setAnalysis] = useState<AnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

        <nav className="rail-navigation">
          <a className="rail-link rail-link-active" href="#workspace">
            <Layers3 size={17} />
            <span>Workspace</span>
          </a>

          <a className="rail-link" href="#upload">
            <FileSearch size={17} />
            <span>Evidence</span>
          </a>

          <a className="rail-link" href="#assets">
            <Sparkles size={17} />
            <span>Assets</span>
          </a>

          <a className="rail-link" href="#amd">
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

        <EvidenceUploadPanel
          onInvestigationCreated={(createdAnalysis) => {
            setAnalysis(createdAnalysis);

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

              <section className="command-card command-card-timeline">
                <div className="command-card-label">
                  <Activity size={15} />
                  EVIDENCE TIMELINE
                </div>

                <div className="modern-timeline">
                  {analysis.timeline.map((event) => (
                    <article className="modern-timeline-item" key={event.timestamp}>
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

            <section className="command-card evidence-command-card" id="evidence">
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

                      <span className={`evidence-severity ${severityClass(item.severity)}`}>
                        {item.severity}
                      </span>
                    </div>

                    <span className="evidence-source-type">{item.sourceType}</span>

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

                    <div>
                      <small>{asset.status}</small>
                      <button type="button">
                        Open draft <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </article>
                ))}
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

              <button type="button">
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
          </section>
        )}
      </section>
    </main>
  );
}