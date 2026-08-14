"use client";

import {
  Sparkles,
  ClipboardList,
  Mail,
  TriangleAlert,
  CircleHelp,
  CalendarDays,
  User,
  FileText,
} from "lucide-react";

import CopyButton from "./CopyButton";

import type {
  Analysis,
  Conversation,
} from "@/types/conversation";

type AnalysisConversation = Omit<
  Conversation,
  "analysis"
> & {
  analysis: Analysis;
};

type AnalysisCardProps = {
  conversation: AnalysisConversation;
};

export default function AnalysisCard({
  conversation,
}: AnalysisCardProps) {
  const { analysis } = conversation;

  return (
    <div className="space-y-8">

      {/* Hero */}
      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 shadow-xl">

        <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500" />

        <div className="p-8">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            <Sparkles size={16} />
            AI Analysis Complete
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white">
            {conversation.title}
          </h1>

          <div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-400">

            <div className="flex items-center gap-2">
              <User size={16} />
              {conversation.clientName || "Unknown Client"}
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays size={16} />
              {new Date(
                conversation.createdAt
              ).toLocaleString()}
            </div>

          </div>

        </div>

      </section>

      {/* Summary */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">

        <div className="mb-6 flex items-center gap-3">
          <FileText className="text-blue-400" />

          <h2 className="text-2xl font-bold text-white">
            Executive Summary
          </h2>
        </div>

        <p className="leading-8 text-slate-300">
          {analysis.summary}
        </p>

      </section>

      {/* Action Items */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">

        <div className="mb-6 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <ClipboardList className="text-blue-400" />

            <h2 className="text-2xl font-bold text-white">
              Action Items
            </h2>
          </div>

          <CopyButton
            text={analysis.actionItems
              .map(
                (item) =>
                  `${item.priority}: ${item.task}`
              )
              .join("\n")}
          />

        </div>

        <div className="space-y-4">

          {analysis.actionItems.length === 0 ? (
            <p className="text-slate-400">
              No action items identified.
            </p>
          ) : (
            analysis.actionItems.map(
              (item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-700 bg-slate-950 p-5 md:flex-row md:items-center md:justify-between"
                >

                  <p className="text-slate-200">
                    {item.task}
                  </p>

                  <span
                    className={`rounded-full px-4 py-2 text-xs font-semibold ${
                      item.priority === "High"
                        ? "bg-red-500/20 text-red-400"
                        : item.priority === "Medium"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {item.priority}
                  </span>

                </div>
              )
            )
          )}

        </div>

      </section>

      {/* Open Questions */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">

        <div className="mb-6 flex items-center gap-3">
          <CircleHelp className="text-blue-400" />

          <h2 className="text-2xl font-bold text-white">
            Open Questions
          </h2>
        </div>

        <div className="space-y-4">

          {analysis.openQuestions.length === 0 ? (
            <p className="text-slate-400">
              No open questions identified.
            </p>
          ) : (
            analysis.openQuestions.map(
              (question, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-700 bg-slate-950 p-5"
                >
                  <p className="text-slate-300">
                    {question}
                  </p>
                </div>
              )
            )
          )}

        </div>

      </section>

      {/* Draft Email */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">

        <div className="mb-6 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <Mail className="text-blue-400" />

            <h2 className="text-2xl font-bold text-white">
              Follow-up Email
            </h2>
          </div>

          <CopyButton
            text={analysis.draftEmail}
          />

        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-950 p-6">

          <pre className="whitespace-pre-wrap font-sans leading-8 text-slate-300">
            {analysis.draftEmail}
          </pre>

        </div>

      </section>

      {/* Risk Flags */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">

        <div className="mb-6 flex items-center gap-3">
          <TriangleAlert className="text-red-400" />

          <h2 className="text-2xl font-bold text-white">
            Risk Flags
          </h2>

        </div>

        {analysis.riskFlags.length === 0 ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-emerald-400">
            ✅ No major risks detected.
          </div>
        ) : (
          <div className="space-y-4">

            {analysis.riskFlags.map(
              (risk, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300"
                >
                  {risk}
                </div>
              )
            )}

          </div>
        )}

      </section>

    </div>
  );
}