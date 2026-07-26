"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  MessageSquare,
  FileText,
  User,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/layout/Navbar";
import api from "@/services/api";

export default function NewAnalysisPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [rawInput, setRawInput] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const response = await api.post("/conversations", {
        title,
        clientName,
        rawInput,
      });

      toast.success("Analysis generated successfully!");

      router.push(
        `/dashboard/${response.data.conversationId}`
      );
    } catch (error: unknown) {
      let message = "Failed to generate analysis.";

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        message =
          axiosError.response?.data?.message ??
          message;
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12">

        {/* Hero */}
        <div className="mb-12">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            <Sparkles size={16} />
            AI Conversation Analyzer
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-white">
            Create New Analysis
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-400">
            Turn messy client conversations into clean summaries,
            actionable tasks, follow-up emails and risk insights
            using AI.
          </p>

        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Form */}
          <div className="lg:col-span-2">

            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl"
            >

              <div className="space-y-6">

                {/* Title */}
                <div>

                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                    <FileText size={16} />
                    Analysis Title
                  </label>

                  <input
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                    placeholder="Website Redesign Meeting"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />

                </div>

                {/* Client */}
                <div>

                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                    <User size={16} />
                    Client Name
                  </label>

                  <input
                    value={clientName}
                    onChange={(e) =>
                      setClientName(e.target.value)
                    }
                    placeholder="Acme Inc."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />

                </div>

                {/* Conversation */}
                <div>

                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                    <MessageSquare size={16} />
                    Conversation
                  </label>

                  <textarea
                    value={rawInput}
                    onChange={(e) =>
                      setRawInput(e.target.value)
                    }
                    rows={14}
                    placeholder="Paste your WhatsApp chat, Zoom transcript, Slack messages or meeting notes..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />

                </div>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 font-semibold text-white transition hover:scale-[1.01] hover:shadow-xl hover:shadow-blue-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Wand2 size={18} />

                  {loading
                    ? "Analyzing Conversation..."
                    : "Generate AI Analysis"}
                </button>

                {loading && (
                  <p className="text-center text-sm text-slate-400">
                    AI is processing your conversation...
                    This may take a few seconds.
                  </p>
                )}

              </div>

            </form>

          </div>

          {/* Sidebar */}

          <div className="space-y-6">

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

              <h3 className="mb-4 text-xl font-semibold text-white">
                AI will generate
              </h3>

              <div className="space-y-4">

                <div className="rounded-xl bg-slate-950 p-4">
                  <h4 className="font-medium text-white">
                    📝 Summary
                  </h4>
                  <p className="mt-1 text-sm text-slate-400">
                    Concise meeting summary.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 p-4">
                  <h4 className="font-medium text-white">
                    ✅ Action Items
                  </h4>
                  <p className="mt-1 text-sm text-slate-400">
                    Tasks with priorities.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 p-4">
                  <h4 className="font-medium text-white">
                    📧 Draft Email
                  </h4>
                  <p className="mt-1 text-sm text-slate-400">
                    Ready-to-send follow-up email.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 p-4">
                  <h4 className="font-medium text-white">
                    🚩 Risks
                  </h4>
                  <p className="mt-1 text-sm text-slate-400">
                    Missing information and blockers.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </main>
    </>
  );
}