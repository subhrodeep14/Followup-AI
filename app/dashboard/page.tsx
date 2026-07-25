"use client";

import { useEffect, useState, useCallback } from "react";

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

  const fetchConversations = useCallback(async () => {
    try {
      const response = await api.get("/conversations");
      setConversations(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  async function handleDelete() {
    await fetchConversations();
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto min-h-screen max-w-7xl px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Dashboard
            </h1>

            <p className="mt-2 text-slate-500">
              View all your AI-generated conversation analyses.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-slate-500">
            Loading...
          </p>
        ) : conversations.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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