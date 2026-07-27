import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Mail,
  ClipboardCheck,
  BrainCircuit,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[130px]" />
        <div className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      {/* Navbar */}

      <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
              <Sparkles size={20} />
            </div>

            <span className="text-lg font-bold tracking-tight">
              FollowUp AI
            </span>
          </Link>

          <div className="flex items-center gap-3">

            <Link
              href="/login"
              className="hidden rounded-lg border border-slate-700 px-5 py-2 text-sm transition hover:border-blue-500 hover:bg-slate-900 sm:block"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-semibold transition hover:scale-105"
            >
              Get Started
            </Link>

          </div>

        </div>

      </header>

      {/* Hero */}

      <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl flex-col items-center justify-center px-6 py-20">

        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-sm text-blue-400">
          <Sparkles size={16} />
          AI Powered Meeting Assistant
        </div>

        <h1 className="max-w-5xl text-center text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
          Turn Client Conversations into
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            {" "}
            Actionable Work
          </span>
        </h1>

        <p className="mt-8 max-w-3xl text-center text-lg leading-8 text-slate-400 md:text-xl">
          FollowUp AI transforms WhatsApp chats, Zoom meetings and
          client discussions into AI-powered summaries, action items,
          professional follow-up emails and risk insights.
        </p>

        {/* CTA */}

        <div className="mt-12 flex w-full max-w-md flex-col gap-4 sm:max-w-none sm:flex-row sm:justify-center">

          <Link
            href="/register"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 font-semibold transition hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-600/30 sm:w-auto"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-8 py-4 font-semibold transition hover:border-blue-500 hover:bg-slate-800 sm:hidden"
          >
            Login
          </Link>

        </div>

        {/* Features */}

        <div className="mt-24 grid w-full gap-6 md:grid-cols-3">

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 transition hover:-translate-y-1 hover:border-blue-500/40">

            <BrainCircuit
              size={34}
              className="text-blue-400"
            />

            <h3 className="mt-5 text-xl font-semibold">
              AI Summary
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              Understand long client conversations instantly with
              concise AI-generated summaries.
            </p>

          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 transition hover:-translate-y-1 hover:border-blue-500/40">

            <ClipboardCheck
              size={34}
              className="text-emerald-400"
            />

            <h3 className="mt-5 text-xl font-semibold">
              Action Items
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              Automatically identify tasks and prioritize what needs
              attention.
            </p>

          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 transition hover:-translate-y-1 hover:border-blue-500/40">

            <Mail
              size={34}
              className="text-purple-400"
            />

            <h3 className="mt-5 text-xl font-semibold">
              Follow-up Emails
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              Generate professional follow-up emails ready to send in
              seconds.
            </p>

          </div>

        </div>

        {/* Benefits */}

        <div className="mt-24 w-full rounded-3xl border border-slate-800 bg-slate-900/80 p-10">

          <h2 className="text-center text-3xl font-bold">
            Why FollowUp AI?
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">

            {[
              "Summarize meetings in seconds",
              "Extract actionable tasks",
              "Generate follow-up emails",
              "Identify risks & missing information",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl bg-slate-950 p-5"
              >
                <CheckCircle2
                  size={22}
                  className="text-emerald-400"
                />

                <span className="text-slate-300">
                  {item}
                </span>

              </div>
            ))}

          </div>

        </div>

        {/* Footer */}

        <footer className="mt-20 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          Built with ❤️ by <span className="text-white">Subhrodeep Acharya</span>
        </footer>

      </section>

    </main>
  );
}