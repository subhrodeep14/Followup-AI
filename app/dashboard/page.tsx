"use client";

import { useEffect, useState} from "react";
import Link from "next/link";
import {
  Sparkles,
  FileText,
  Plus,
  Clock3,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import EmptyState from "@/components/dashboard/EmptyState";
import ConversationCard from "@/components/dashboard/ConversationCard";

import api from "@/services/api";

type Conversation = {
  id: string;
  title: string;
  clientName: string | null;
  createdAt: string;
  analysis: {
    summary: string;
  };
};

export default function DashboardPage() {
 const [conversations, setConversations] = useState<Conversation[]>([]);
const [loading, setLoading] = useState(true);

async function loadConversations() {
  try {
    const response = await api.get("/conversations");
    setConversations(response.data.data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  let mounted = true;

  async function load() {
    try {
      const response = await api.get("/conversations");

      if (mounted) {
        setConversations(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  }

  load();

  return () => {
    mounted = false;
  };
}, []);

async function handleDelete() {
  await loadConversations();
}

  return (
    <>
      <Navbar />

      <main className="mx-auto min-h-screen max-w-7xl px-6 py-10">

        {/* Hero Section */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
              <Sparkles size={16} />
              AI Workspace
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-white">
              Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
              Analyze client conversations, generate summaries,
              extract action items and draft professional follow-up
              emails—all in one place.
            </p>
          </div>

          <Link
            href="/dashboard/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30"
          >
            <Plus size={18} />
            New Analysis
          </Link>

        </div>

        {/* Stats */}
        <div className="mb-10 grid gap-5 md:grid-cols-2">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-400">
                  Total Analyses
                </p>

                <h2 className="mt-2 text-4xl font-bold text-white">
                  {conversations.length}
                </h2>
              </div>

              <div className="rounded-xl bg-blue-500/10 p-4 text-blue-400">
                <FileText size={28} />
              </div>

            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-400">
                  Status
                </p>

                <h2 className="mt-2 text-2xl font-bold text-green-400">
                  Ready
                </h2>
              </div>

              <div className="rounded-xl bg-green-500/10 p-4 text-green-400">
                <Clock3 size={28} />
              </div>

            </div>
          </div>

        </div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
              />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {conversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                id={conversation.id}
                title={conversation.title}
                clientName={conversation.clientName}
                summary={conversation.analysis.summary}
                createdAt={conversation.createdAt}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

      </main>
    </>
  );
}