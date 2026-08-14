"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Sparkles,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import AnalysisCard from "@/components/analysis/AnalysisCard";
import api from "@/services/api";
import { Conversation } from "@/types/conversation";

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [conversation, setConversation] =
    useState<Conversation | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || id === "undefined") {
      setError("Invalid conversation ID.");
      setLoading(false);
      return;
    }

    async function fetchConversation() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/conversations/${id}`
        );

        setConversation(response.data.data);
      } catch (err: unknown) {
        console.error(
          "Failed to load analysis:",
          err
        );

        setError(
          (
            err as {
              response?: {
                data?: {
                  message?: string;
                };
              };
            }
          ).response?.data?.message ||
            "Failed to load analysis."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchConversation();
  }, [id]);

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-64px)] bg-slate-950 px-6 py-10">
        <div className="mx-auto max-w-6xl">

          {/* Back */}
          <button
            onClick={() => router.push("/dashboard")}
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

          {/* Loading */}
          {loading && (
            <div className="flex min-h-[500px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

                <p className="text-slate-400">
                  Generating analysis...
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-10 text-center">

              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
                <FileText
                  size={26}
                  className="text-red-400"
                />
              </div>

              <h1 className="text-2xl font-bold text-white">
                Unable to load analysis
              </h1>

              <p className="mt-3 text-slate-400">
                {error}
              </p>

            </div>
          )}

          {/* Analysis */}
          {!loading &&
            !error &&
            conversation &&
            conversation.analysis && (
              <>
                {/* Header */}
                <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900 p-8">

                  <div className="flex items-start gap-5">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500">
                      <Sparkles
                        size={26}
                        className="text-white"
                      />
                    </div>

                    <div className="min-w-0">

                      <p className="mb-2 text-sm font-medium uppercase tracking-wider text-blue-400">
                        AI Analysis
                      </p>

                      <h1 className="break-words text-3xl font-bold text-white">
                        {conversation.title}
                      </h1>

                      <p className="mt-3 text-sm text-slate-400">
                        AI-generated conversation analysis
                      </p>

                    </div>

                  </div>

                </div>

                <AnalysisCard
  conversation={{
    ...conversation,
    analysis: conversation.analysis,
  }}
/>
              </>
            )}

          {/* No analysis */}
          {!loading &&
            !error &&
            conversation &&
            !conversation.analysis && (
              <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-12 text-center">

                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-500/10">
                  <Sparkles
                    size={30}
                    className="text-yellow-400"
                  />
                </div>

                <h1 className="text-2xl font-bold text-white">
                  Analysis Not Available
                </h1>

                <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-400">
                  This conversation does not have an AI
                  analysis yet. The conversation was created,
                  but the analysis result was not saved.
                </p>

                <button
                  onClick={() =>
                    router.push("/dashboard/new")
                  }
                  className="mt-7 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Create New Analysis
                </button>

              </div>
            )}

        </div>
      </main>
    </>
  );
}