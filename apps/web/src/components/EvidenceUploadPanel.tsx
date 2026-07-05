"use client";

import { ChangeEvent, useState } from "react";

type UploadCategory = "video" | "screenshot" | "log";

type UploadedEvidence = {
  uploadId: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  category: string;
  storedPath: string;
  uploadedAtUtc: string;
};

type InvestigationRequest = {
  title: string;
  description: string;
  environment: string;
  releaseVersion: string;
  evidence: {
    fileName: string;
    category: string;
    storedPath: string;
    sizeBytes: number;
  }[];
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
  timeline: {
    timestamp: string;
    title: string;
    description: string;
    severity: string;
  }[];
  evidence: {
    id: string;
    sourceType: string;
    sourceReference: string;
    summary: string;
    severity: string;
  }[];
  generatedAssets: {
    type: string;
    title: string;
    contentPreview: string;
    status: string;
  }[];
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

type Props = {
  onInvestigationCreated: (analysis: AnalysisReport) => void;
};

const uploadOptions: {
  category: UploadCategory;
  label: string;
  description: string;
  accept: string;
  icon: string;
  color: string;
}[] = [
  {
    category: "video",
    label: "Video recording",
    description: "MP4, WebM or MOV · up to 95 MB",
    accept: "video/*",
    icon: "▶",
    color:
      "from-cyan-400/20 to-blue-500/10 border-cyan-300/25 hover:border-cyan-300",
  },
  {
    category: "screenshot",
    label: "Screenshot",
    description: "PNG, JPG or WebP · UI evidence",
    accept: "image/*",
    icon: "◈",
    color:
      "from-violet-400/20 to-fuchsia-500/10 border-violet-300/25 hover:border-violet-300",
  },
  {
    category: "log",
    label: "Application log",
    description: "TXT, LOG or JSON · technical trace",
    accept: ".txt,.log,.json,text/plain,application/json",
    icon: "≡",
    color:
      "from-emerald-400/20 to-teal-500/10 border-emerald-300/25 hover:border-emerald-300",
  },
];

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.ceil(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getCategoryLabel(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export default function EvidenceUploadPanel({
  onInvestigationCreated,
}: Props) {
  const [uploads, setUploads] = useState<UploadedEvidence[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [environment, setEnvironment] = useState("Production");
  const [releaseVersion, setReleaseVersion] = useState("");

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
    category: UploadCategory
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 95 * 1024 * 1024) {
      setError("Please choose a file below 95 MB for this demo.");
      return;
    }

    setIsUploading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);

      const response = await fetch(
        "http://localhost:5166/api/evidence/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Upload failed.");
      }

      const result = (await response.json()) as UploadedEvidence;

      setUploads((current) => [...current, result]);
      setMessage(`${file.name} was added to the investigation.`);
      event.target.value = "";
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload the evidence file."
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function createInvestigation() {
    setError("");
    setMessage("");

    if (!title.trim()) {
      setError("Add a clear incident title before creating the investigation.");
      return;
    }

    if (!description.trim()) {
      setError("Describe what happened so SpecTrace can create useful context.");
      return;
    }

    if (uploads.length === 0) {
      setError("Attach at least one evidence file before creating the investigation.");
      return;
    }

    setIsCreating(true);

    try {
      const request: InvestigationRequest = {
        title: title.trim(),
        description: description.trim(),
        environment,
        releaseVersion: releaseVersion.trim() || "Not specified",
        evidence: uploads.map((upload) => ({
          fileName: upload.fileName,
          category: upload.category,
          storedPath: upload.storedPath,
          sizeBytes: upload.sizeBytes,
        })),
      };

      const response = await fetch(
        "http://localhost:5166/api/analyses/investigate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          errorMessage || "SpecTrace could not create the investigation."
        );
      }

      const analysis = (await response.json()) as AnalysisReport;

      await new Promise((resolve) => setTimeout(resolve, 1350));

      onInvestigationCreated(analysis);
      setMessage("Evidence investigation created successfully.");
    } catch (investigationError) {
      setError(
        investigationError instanceof Error
          ? investigationError.message
          : "Unable to create the investigation."
      );
    } finally {
      setIsCreating(false);
    }
  }

  return (
    
      <section
        id="upload"
        className="relative z-10 mx-auto mt-4 max-w-[1650px] overflow-hidden rounded-[28px] border border-cyan-200/15 bg-gradient-to-br from-slate-900/85 via-slate-950/80 to-cyan-950/20 shadow-[0_30px_90px_rgba(0,0,0,0.24)]"
      >
      <div className="border-b border-cyan-100/10 px-6 py-6 sm:px-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div>
            <p className="mb-2 text-xs font-bold tracking-[0.18em] text-cyan-300">
              NEW INVESTIGATION
            </p>

            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Add product evidence
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Connect recordings, screenshots, logs, and release context into
              one evidence-linked engineering investigation.
            </p>
          </div>

          <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold text-cyan-200">
            {isUploading
              ? "Uploading evidence..."
              : isCreating
                ? "Creating investigation..."
                : `${uploads.length} evidence item${uploads.length === 1 ? "" : "s"} attached`}
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="grid gap-4 md:grid-cols-3">
          {uploadOptions.map((option) => (
            <label
              key={option.category}
              className={`group relative min-h-[220px] cursor-pointer overflow-hidden rounded-2xl border bg-gradient-to-br p-5 transition duration-200 hover:-translate-y-1 hover:shadow-2xl ${option.color}`}
            >
              <input
                type="file"
                accept={option.accept}
                disabled={isUploading || isCreating}
                className="sr-only"
                onChange={(event) => handleFileChange(event, option.category)}
              />

              <div className="flex h-full flex-col">
                <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-slate-950/45 text-xl font-bold text-white shadow-lg">
                  {option.icon}
                </div>

                <h3 className="text-base font-bold text-white">
                  {option.label}
                </h3>

                <p className="mt-2 text-sm leading-5 text-slate-300">
                  {option.description}
                </p>

                <div className="mt-auto pt-7">
                  <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-slate-950/50 px-3 py-2 text-xs font-bold text-cyan-200 transition group-hover:bg-cyan-300/15">
                    {isUploading ? "Please wait..." : "Choose evidence file"}
                    <span>→</span>
                  </span>
                </div>
              </div>
            </label>
          ))}
        </div>

        {message && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-200">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-300/20 font-bold">
              ✓
            </span>
            {message}
          </div>
        )}

        {error && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-300/20 font-bold">
              !
            </span>
            {error}
          </div>
        )}

        {uploads.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold tracking-[0.14em] text-slate-400">
                ATTACHED EVIDENCE
              </p>

              <span className="text-xs text-slate-500">
                Ready for investigation
              </span>
            </div>

            <div className="grid gap-3">
              {uploads.map((upload) => (
                <article
                  key={upload.uploadId}
                  className="flex flex-col gap-4 rounded-xl border border-white/10 bg-slate-950/45 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-cyan-300/10 text-sm font-bold text-cyan-200">
                      {upload.category === "video"
                        ? "▶"
                        : upload.category === "screenshot"
                          ? "◈"
                          : "≡"}
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-semibold text-white">
                        {upload.fileName}
                      </h4>

                      <p className="mt-1 text-xs text-slate-400">
                        {getCategoryLabel(upload.category)} ·{" "}
                        {formatFileSize(upload.sizeBytes)}
                      </p>
                    </div>
                  </div>

                  <span className="w-fit rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-bold text-emerald-200">
                    Evidence attached
                  </span>
                </article>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 border-t border-white/10 pt-7">
          <div className="mb-5">
            <p className="text-xs font-bold tracking-[0.16em] text-cyan-300">
              INCIDENT CONTEXT
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              Create evidence investigation
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Add the release context so the AI pipeline can generate a
              traceable engineering analysis instead of a generic report.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                Incident title
              </span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                disabled={isCreating}
                placeholder="e.g. Checkout confirmation fails after release"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                Environment
              </span>
              <select
                value={environment}
                onChange={(event) => setEnvironment(event.target.value)}
                disabled={isCreating}
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/10"
              >
                <option>Production</option>
                <option>Staging</option>
                <option>Pre-production</option>
                <option>Development</option>
              </select>
            </label>

            <label className="block lg:col-span-2">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                What happened?
              </span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                disabled={isCreating}
                rows={4}
                placeholder="Describe the customer impact, expected behavior, and what changed after the release..."
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                Release version
              </span>
              <input
                value={releaseVersion}
                onChange={(event) => setReleaseVersion(event.target.value)}
                disabled={isCreating}
                placeholder="e.g. 2026.07.05.1"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/10"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-xs leading-5 text-slate-500">
              SpecTrace will preserve the links between your original evidence,
              generated root-cause hypothesis, and QA outputs.
            </p>

            <button
              type="button"
              onClick={createInvestigation}
              disabled={isCreating || isUploading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-sky-400 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-[0_12px_32px_rgba(34,211,238,0.22)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreating ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                  Creating evidence graph...
                </>
              ) : (
                <>
                  Create evidence investigation
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}