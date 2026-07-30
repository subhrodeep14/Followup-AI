"use client";

import { useState } from "react";
import { Loader2, SendHorizonal, FileText } from "lucide-react";
import { toast } from "sonner";

type Citation = {
  chunkId: string;
  preview: string;
  score: number;
};

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const [answer, setAnswer] = useState("");

  const [citations, setCitations] = useState<Citation[]>([]);

  async function askQuestion() {
    if (!question.trim()) {
      toast.error("Enter a question.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      setAnswer(data.answer);
      setCitations(data.citations);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <h1 className="mb-5 text-3xl font-bold text-white">
          AI Document Chat
        </h1>

        <div className="flex gap-3">

          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                askQuestion();
              }
            }}
            placeholder="Ask anything about your uploaded documents..."
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          />

          <button
            onClick={askQuestion}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Thinking...
              </>
            ) : (
              <>
                <SendHorizonal size={18} />
                Ask
              </>
            )}
          </button>

        </div>

      </div>

      {answer && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="mb-3 text-xl font-semibold text-white">
            Answer
          </h2>

          <p className="whitespace-pre-wrap leading-8 text-slate-300">
            {answer}
          </p>

        </div>
      )}

      {citations.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="mb-5 text-xl font-semibold text-white">
            Sources
          </h2>

          <div className="space-y-4">

            {citations.map((citation) => (
              <div
                key={citation.chunkId}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >

                <div className="mb-3 flex items-center gap-2 text-blue-400">

                  <FileText size={18} />

                  <span className="font-medium">
                    Chunk {citation.chunkId.slice(-6)}
                  </span>

                </div>

                <p className="text-sm leading-7 text-slate-400">
                  {citation.preview}
                </p>

                <p className="mt-3 text-xs text-green-400">
                  Similarity: {(citation.score * 100).toFixed(2)}%
                </p>

              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  );
}