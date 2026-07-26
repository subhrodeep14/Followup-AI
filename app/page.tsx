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
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />

      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-20">

        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-sm text-blue-400">
          <Sparkles size={16} />
          AI Powered Meeting Assistant
        </div>

        {/* Hero */}
        <h1 className="max-w-5xl text-center text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
          Turn Client Conversations into
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            {" "}
            Actionable Work
          </span>
        </h1>

        <p className="mt-8 max-w-3xl text-center text-lg leading-8 text-slate-400 md:text-xl">
          FollowUp AI transforms messy WhatsApp chats,
          Zoom transcripts and meeting notes into
          summaries, action items, follow-up emails and
          risk insights within seconds.
        </p>

        {/* CTA */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row">

          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 font-semibold transition hover:scale-105 hover:shadow-xl hover:shadow-blue-600/30"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/login"
            className="rounded-xl border border-slate-700 bg-slate-900 px-8 py-4 font-semibold transition hover:border-blue-500 hover:bg-slate-800"
          >
            Login
          </Link>

        </div>

        {/* Features */}

        <div className="mt-24 grid w-full gap-6 md:grid-cols-3">

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 transition hover:-translate-y-1 hover:border-blue-500/40">

            <BrainCircuit
              size={34}
              className="text-blue-400"
            />

            <h3 className="mt-5 text-xl font-semibold">
              AI Summary
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              Instantly understand long client
              conversations with concise AI-generated
              summaries.
            </p>

          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 transition hover:-translate-y-1 hover:border-blue-500/40">

            <ClipboardCheck
              size={34}
              className="text-green-400"
            />

            <h3 className="mt-5 text-xl font-semibold">
              Action Items
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              Extract tasks automatically and prioritize
              what needs to be done next.
            </p>

          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 transition hover:-translate-y-1 hover:border-blue-500/40">

            <Mail
              size={34}
              className="text-purple-400"
            />

            <h3 className="mt-5 text-xl font-semibold">
              Follow-up Emails
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              Generate professional emails ready to copy
              and send to clients.
            </p>

          </div>

        </div>

        {/* Benefits */}

        <div className="mt-24 w-full rounded-3xl border border-slate-800 bg-slate-900 p-10">

          <h2 className="text-center text-3xl font-bold">
            Why FollowUp AI?
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">

            {[
              "Summarize meetings in seconds",
              "Extract actionable tasks",
              "Generate professional follow-up emails",
              "Identify risks and missing information",
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

        <footer className="mt-20 text-center text-sm text-slate-500">
          Built with ❤️ using Next.js, Prisma, Neon &
          Gemini AI.
        </footer>

      </section>
    </main>
  );
}