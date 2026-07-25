import Link from "next/link";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900 px-8 py-20 text-center">
      <h2 className="text-2xl font-semibold text-white">
        No Conversations Yet
      </h2>

      <p className="mt-3 max-w-md text-slate-400">
        Start by analyzing your first client conversation.
        Your AI-generated summaries and action items will appear here.
      </p>

      <Link
        href="/dashboard/new"
        className="mt-8 rounded-lg bg-white px-6 py-3 font-medium text-slate-900 transition hover:bg-slate-200"
      >
        New Analysis
      </Link>
    </div>
  );
}