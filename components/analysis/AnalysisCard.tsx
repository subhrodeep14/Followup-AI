"use client";

import CopyButton from "./CopyButton";

type ActionItem = {
  task: string;
  priority: "High" | "Medium" | "Low";
};

type Analysis = {
  summary: string;
  actionItems: ActionItem[];
  openQuestions: string[];
  draftEmail: string;
  riskFlags: string[];
};

type Conversation = {
  id: string;
  title: string;
  clientName?: string | null;
  createdAt: string;
  analysis: Analysis;
};

type AnalysisCardProps = {
  conversation: Conversation;
};

export default function AnalysisCard({
  conversation,
}: AnalysisCardProps) {
  const { analysis } = conversation;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-3xl font-bold text-white">
          {conversation.title}
        </h1>

        <p className="mt-2 text-slate-400">
          Client: {conversation.clientName || "Unknown Client"}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {new Date(conversation.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Summary */}
      <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-4 text-2xl font-semibold text-white">
          Summary
        </h2>

        <p className="leading-7 text-slate-300">
          {analysis.summary}
        </p>
      </section>

      {/* Action Items */}
      <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">
            Action Items
          </h2>

          <CopyButton
            text={analysis.actionItems
              .map(
                (item) =>
                  `${item.priority}: ${item.task}`
              )
              .join("\n")}
          />
        </div>

        <ul className="space-y-3">
          {analysis.actionItems.map((item, index) => (
            <li
              key={index}
              className="flex items-start justify-between rounded-lg border border-slate-700 p-4"
            >
              <span className="text-slate-200">
                {item.task}
              </span>

              <span
                className={`rounded px-3 py-1 text-xs font-semibold ${
                  item.priority === "High"
                    ? "bg-red-600 text-white"
                    : item.priority === "Medium"
                    ? "bg-yellow-500 text-black"
                    : "bg-green-600 text-white"
                }`}
              >
                {item.priority}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Open Questions */}
      <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-4 text-2xl font-semibold text-white">
          Open Questions
        </h2>

        <ul className="list-disc space-y-2 pl-6 text-slate-300">
          {analysis.openQuestions.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ul>
      </section>

      {/* Draft Email */}
      <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">
            Draft Email
          </h2>

          <CopyButton text={analysis.draftEmail} />
        </div>

        <pre className="whitespace-pre-wrap font-sans leading-7 text-slate-300">
          {analysis.draftEmail}
        </pre>
      </section>

      {/* Risk Flags */}
      <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-4 text-2xl font-semibold text-white">
          Risk Flags
        </h2>

        {analysis.riskFlags.length === 0 ? (
          <p className="text-green-400">
            No major risks detected.
          </p>
        ) : (
          <ul className="list-disc space-y-2 pl-6 text-red-400">
            {analysis.riskFlags.map((risk, index) => (
              <li key={index}>{risk}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}