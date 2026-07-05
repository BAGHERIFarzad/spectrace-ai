"use client";

import { useState } from "react";

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
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">S</div>
          <div>
            <strong>SpecTrace</strong>
            <span>Evidence Intelligence</span>
          </div>
        </div>

        <nav className="nav-links">
          <a className="nav-link active" href="#workspace">
            <span>◈</span> Workspace
          </a>
          <a className="nav-link" href="#evidence">
            <span>◌</span> Evidence
          </a>
          <a className="nav-link" href="#assets">
            <span>✦</span> Generated Assets
          </a>
          <a className="nav-link" href="#amd">
            <span>▣</span> AMD Processing
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="gpu-indicator">
            <span className="pulse" />
            AMD-ready pipeline
          </div>
          <p>Built for traceable AI-assisted quality engineering.</p>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">PRODUCT EVIDENCE WORKSPACE</p>
            <h1>Turn product evidence into release-ready action.</h1>
          </div>

          <button
            className="primary-button"
            onClick={loadDemoAnalysis}
            disabled={isLoading}
          >
            {isLoading ? "Analyzing evidence..." : "Load demo incident"}
          </button>
        </header>

        {!analysis && !isLoading && (
          <section className="empty-state" id="workspace">
            <div className="empty-orb">◈</div>
            <p className="eyebrow">READY FOR ANALYSIS</p>
            <h2>Trace every bug back to the evidence.</h2>
            <p>
              Load our checkout incident demo to explore video evidence, logs,
              root-cause reasoning, generated tests, and approval controls.
            </p>

            <button className="secondary-button" onClick={loadDemoAnalysis}>
              Explore checkout failure demo
            </button>
          </section>
        )}

        {isLoading && (
          <section className="loading-state">
            <div className="loader" />
            <h2>Building an evidence graph</h2>
            <p>
              Correlating video frames, logs, API traces, and customer signals.
            </p>
          </section>
        )}

        {error && <div className="error-banner">{error}</div>}

        {analysis && (
          <div className="dashboard-grid" id="workspace">
            <section className="hero-card">
              <div className="hero-card-top">
                <div>
                  <p className="eyebrow">ANALYSIS {analysis.analysisId}</p>
                  <h2>{analysis.title}</h2>
                </div>
                <span className="status-pill">{analysis.status}</span>
              </div>

              <p className="hero-summary">{analysis.executiveSummary}</p>

              <div className="metric-row">
                <div className="metric risk-metric">
                  <span>Release risk</span>
                  <strong>{analysis.riskScore}</strong>
                  <small>{analysis.riskLevel} priority</small>
                </div>

                <div className="metric">
                  <span>Root-cause confidence</span>
                  <strong>{analysis.rootCause.confidence}%</strong>
                  <small>Evidence-linked conclusion</small>
                </div>

                <div className="metric">
                  <span>Evidence sources</span>
                  <strong>{analysis.evidence.length}</strong>
                  <small>Cross-validated signals</small>
                </div>
              </div>
            </section>

            <section className="root-cause-card">
              <div className="card-label">
                <span>✦</span> ROOT-CAUSE HYPOTHESIS
              </div>
              <h3>{analysis.rootCause.title}</h3>
              <p>{analysis.rootCause.description}</p>

              <div className="recommendation">
                <strong>Recommended action</strong>
                <span>{analysis.rootCause.recommendation}</span>
              </div>
            </section>

            <section className="timeline-card">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">USER JOURNEY</p>
                  <h3>Failure timeline</h3>
                </div>
                <span className="count-badge">{analysis.timeline.length} events</span>
              </div>

              <div className="timeline">
                {analysis.timeline.map((event) => (
                  <article className="timeline-item" key={event.timestamp}>
                    <span className={`timeline-dot ${severityClass(event.severity)}`} />
                    <div className="timeline-time">{event.timestamp}</div>
                    <div>
                      <h4>{event.title}</h4>
                      <p>{event.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="evidence-card" id="evidence">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">TRACEABLE PROOF</p>
                  <h3>Evidence graph</h3>
                </div>
                <span className="verified-label">Verified links</span>
              </div>

              <div className="evidence-list">
                {analysis.evidence.map((item) => (
                  <article className="evidence-item" key={item.id}>
                    <div className={`evidence-icon ${severityClass(item.severity)}`}>
                      {item.sourceType.charAt(0)}
                    </div>
                    <div className="evidence-content">
                      <div className="evidence-meta">
                        <strong>{item.sourceType}</strong>
                        <span>{item.sourceReference}</span>
                      </div>
                      <p>{item.summary}</p>
                    </div>
                    <span className={`severity-tag ${severityClass(item.severity)}`}>
                      {item.severity}
                    </span>
                  </article>
                ))}
              </div>
            </section>

            <section className="assets-card" id="assets">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">ENGINEERING OUTPUTS</p>
                  <h3>Generated assets</h3>
                </div>
              </div>

              <div className="asset-grid">
                {analysis.generatedAssets.map((asset) => (
                  <article className="asset-item" key={asset.title}>
                    <span className="asset-type">{asset.type}</span>
                    <h4>{asset.title}</h4>
                    <p>{asset.contentPreview}</p>
                    <div className="asset-footer">
                      <span>{asset.status}</span>
                      <button type="button">View draft →</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="approval-card">
              <div>
                <p className="eyebrow">HUMAN-IN-THE-LOOP</p>
                <h3>{analysis.humanApproval.status}</h3>
                <p>{analysis.humanApproval.reason}</p>
              </div>
              <button className="approval-button" type="button">
                Review before export
              </button>
            </section>

            <section className="amd-card" id="amd">
              <div className="amd-logo">AMD</div>
              <div>
                <p className="eyebrow">AMD PLATFORM INTEGRATION</p>
                <h3>{analysis.amdProcessing.status}</h3>
                <p>{analysis.amdProcessing.pipeline}</p>
                <small>{analysis.amdProcessing.runtime}</small>
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
}