import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 px-8 py-20 text-center shadow-2xl">

      {/* Background Glow */}
      <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center">

        {/* Icon */}
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-600/30">
          <Sparkles
            size={36}
            className="text-white"
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold tracking-tight text-white">
          No Analyses Yet
        </h2>

        {/* Description */}
        <p className="mt-4 max-w-xl text-lg leading-8 text-slate-400">
          Turn messy client conversations into clean summaries,
          actionable tasks and professional follow-up emails with AI.
        </p>

        {/* CTA */}
        <Link
          href="/dashboard/new"
          className="group mt-10 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30"
        >
          Create Your First Analysis

          <ArrowRight
            size={18}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>

        {/* Feature Pills */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">

          <span className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300">
            ✨ AI Summary
          </span>

          <span className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300">
            ✅ Action Items
          </span>

          <span className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300">
            📧 Draft Email
          </span>

          <span className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300">
            🚩 Risk Detection
          </span>

        </div>
      </div>
    </div>
  );
}