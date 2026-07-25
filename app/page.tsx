import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="max-w-3xl text-center">
        <h1 className="text-6xl font-bold tracking-tight">
          FollowUp AI
        </h1>

        <p className="mt-6 text-lg text-slate-400">
          Turn messy client conversations into professional summaries,
          action items and follow-up emails using AI.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/register"
            className="rounded-lg bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-200"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="rounded-lg border border-slate-700 px-6 py-3 hover:bg-slate-900"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}