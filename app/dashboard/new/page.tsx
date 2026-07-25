"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import api from "@/services/api";

export default function NewAnalysisPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [rawInput, setRawInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/conversations", {
        title,
        clientName,
        rawInput,
      });

      router.push(`/dashboard/${response.data.conversationId}`);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
          "Failed to generate analysis."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 py-10">

        <h1 className="text-4xl font-bold">
          New Analysis
        </h1>

        <p className="mt-2 text-slate-500">
          Paste a client conversation and let AI generate a professional summary,
          tasks and follow-up email.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
        >

          <div>
            <label className="mb-2 block font-medium">
              Title
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Website Redesign Meeting"
              className="w-full rounded-lg border p-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Client Name
            </label>

            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Acme Inc."
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Conversation
            </label>

            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              rows={12}
              placeholder="Paste your WhatsApp chat, Zoom transcript, Slack conversation..."
              className="w-full rounded-lg border p-3"
              required
            />
          </div>

          {error && (
            <p className="text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-black px-6 py-3 text-white disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Analysis"}
          </button>

        </form>
      </main>
    </>
  );
}