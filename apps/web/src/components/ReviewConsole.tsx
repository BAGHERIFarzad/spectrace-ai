"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  MessageSquareText,
  ShieldAlert,
  ShieldCheck,
  X,
} from "lucide-react";

type Decision = "approve" | "changes" | "block";

type Props = {
  analysisId: string;
  investigationTitle: string;
  riskScore: number;
  rootCauseTitle: string;
  onClose: () => void;
  onDecision: (decision: Decision, note: string) => void;
};

const decisionOptions: {
  id: Decision;
  title: string;
  description: string;
  icon: typeof ShieldCheck;
  className: string;
}[] = [
  {
    id: "approve",
    title: "Approve release",
    description:
      "The investigation has been reviewed and the release can proceed.",
    icon: CheckCircle2,
    className:
      "border-emerald-300/25 bg-emerald-300/5 hover:border-emerald-300/60",
  },
  {
    id: "changes",
    title: "Request changes",
    description:
      "The release needs corrective work and another validation cycle.",
    icon: MessageSquareText,
    className:
      "border-amber-300/25 bg-amber-300/5 hover:border-amber-300/60",
  },
  {
    id: "block",
    title: "Block release",
    description:
      "The current evidence indicates unacceptable release risk.",
    icon: ShieldAlert,
    className:
      "border-rose-300/25 bg-rose-300/5 hover:border-rose-300/60",
  },
];

export default function ReviewConsole({
  analysisId,
  investigationTitle,
  riskScore,
  rootCauseTitle,
  onClose,
  onDecision,
}: Props) {
  const [selectedDecision, setSelectedDecision] =
    useState<Decision>("changes");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedOption = decisionOptions.find(
    (option) => option.id === selectedDecision
  );

  async function submitDecision() {
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 850));

    onDecision(selectedDecision, note.trim());
    setIsSubmitting(false);
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#020814]/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[28px] border border-cyan-200/20 bg-[#071526] shadow-[0_30px_100px_rgba(0,0,0,0.58)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent" />

        <header className="flex items-start justify-between gap-5 border-b border-white/10 px-6 py-5 sm:px-8">
          <div className="flex gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-amber-300/25 bg-amber-300/10 text-amber-200">
              <ShieldCheck size={21} />
            </div>

            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-amber-300">
                HUMAN APPROVAL GATE
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Review release decision
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Validate the evidence before changing the release status.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-slate-950/60 text-slate-300 transition hover:border-cyan-300/40 hover:text-white"
            aria-label="Close review console"
          >
            <X size={18} />
          </button>
        </header>

        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_280px]">
          <section>
            <p className="text-xs font-bold tracking-[0.15em] text-cyan-300">
              SELECT A DECISION
            </p>

            <div className="mt-4 grid gap-3">
              {decisionOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedDecision === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedDecision(option.id)}
                    className={`flex items-start gap-4 rounded-2xl border p-4 text-left transition ${option.className} ${
                      isSelected
                        ? "ring-2 ring-cyan-300/30"
                        : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-slate-950/45 text-slate-100">
                      <Icon size={18} />
                    </span>

                    <span>
                      <strong className="block text-sm text-white">
                        {option.title}
                      </strong>

                      <span className="mt-1 block text-sm leading-5 text-slate-400">
                        {option.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <label className="mt-7 block">
              <span className="mb-2 block text-xs font-bold tracking-[0.14em] text-slate-400">
                REVIEWER NOTE
              </span>

              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={5}
                placeholder="Explain the approval, requested fix, or release-blocking concern..."
                className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/10"
              />
            </label>
          </section>

          <aside className="rounded-2xl border border-cyan-300/15 bg-gradient-to-b from-cyan-950/20 to-slate-950/40 p-5">
            <p className="text-xs font-bold tracking-[0.15em] text-cyan-300">
              INVESTIGATION CONTEXT
            </p>

            <div className="mt-5 space-y-5">
              <div>
                <span className="block text-xs text-slate-500">Trace ID</span>
                <strong className="mt-1 block font-mono text-xs text-cyan-200">
                  {analysisId}
                </strong>
              </div>

              <div>
                <span className="block text-xs text-slate-500">
                  Release exposure
                </span>

                <strong className="mt-1 block text-3xl text-rose-300">
                  {riskScore}
                </strong>
              </div>

              <div>
                <span className="block text-xs text-slate-500">
                  Root-cause hypothesis
                </span>

                <strong className="mt-1 block text-sm leading-6 text-white">
                  {rootCauseTitle}
                </strong>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/45 p-4">
                <span className="block text-xs text-slate-500">
                  Investigation
                </span>

                <strong className="mt-2 block text-sm leading-5 text-slate-200">
                  {investigationTitle}
                </strong>
              </div>
            </div>
          </aside>
        </div>

        <footer className="flex flex-col gap-3 border-t border-white/10 bg-slate-950/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-xs text-slate-500">
            Your decision updates the local investigation workspace.
          </p>

          <button
            type="button"
            onClick={submitDecision}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-orange-400 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-[0_10px_28px_rgba(251,191,36,0.2)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-65"
          >
            {isSubmitting
              ? "Recording decision..."
              : `Confirm: ${selectedOption?.title}`}
            <ArrowUpRight size={16} />
          </button>
        </footer>
      </div>
    </div>
  );
}