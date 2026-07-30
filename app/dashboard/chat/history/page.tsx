"use client";

import Link from "next/link";
import {
  
  useEffect,
  useState,
} from "react";
import {
  ArrowLeft,
  MessageSquare,
  CalendarDays,
  Clock3,
  Bot,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import api from "@/services/api";

type Conversation = {
  id: string;
  title: string;
  createdAt: string;
  _count: {
    messages: number;
  };
};

export default function ChatHistoryPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
useEffect(() => {
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

  void loadConversations();
}, []);

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-72px)] bg-slate-950">

        <div className="mx-auto max-w-7xl px-8 py-10">

          <Link
            href="/dashboard/chat"
            className="mb-8 inline-flex items-center gap-2 text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Chat
          </Link>

          {/* Hero */}

          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
                <Bot size={16} />
                AI Conversation History
              </div>

              <h1 className="text-5xl font-bold tracking-tight text-white">
                Chat History
              </h1>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-400">
                Browse your previous AI conversations,
                revisit answers and continue working
                from where you left off.
              </p>

            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 px-8 py-6">

              <p className="text-sm text-slate-400">
                Total Conversations
              </p>

              <h2 className="mt-2 text-4xl font-bold text-white">
                {conversations.length}
              </h2>

            </div>

          </div>

          {/* Loading */}

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-48 animate-pulse rounded-3xl bg-slate-900"
                />
              ))}

            </div>
          ) : conversations.length === 0 ? (

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-16 text-center">

              <MessageSquare
                size={60}
                className="mx-auto mb-6 text-slate-600"
              />

              <h2 className="text-3xl font-bold text-white">
                No Conversations Yet
              </h2>

              <p className="mx-auto mt-4 max-w-xl leading-8 text-slate-400">
                Start chatting with your uploaded
                documents to build your conversation
                history.
              </p>

              <Link
                href="/dashboard/chat"
                className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Start Chatting
              </Link>

            </div>

          ) : (

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {conversations.map((conversation) => (

                <Link
                  key={conversation.id}
                  href={`/dashboard/chat/${conversation.id}`}
                  className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 transition-all hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10"
                >

                  <div className="mb-5 flex items-center justify-between">

                    <div className="rounded-2xl bg-blue-500/10 p-4 text-blue-400">
                      <MessageSquare size={24} />
                    </div>

                    <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                      {conversation._count.messages} msgs
                    </span>

                  </div>

                  <h2 className="line-clamp-2 text-xl font-semibold text-white">
                    {conversation.title}
                  </h2>

                  <div className="mt-8 space-y-3">

                    <div className="flex items-center gap-2 text-sm text-slate-400">

                      <Clock3 size={16} />

                      {conversation._count.messages} Messages

                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-400">

                      <CalendarDays size={16} />

                      {new Date(
                        conversation.createdAt
                      ).toLocaleString()}

                    </div>

                  </div>

                </Link>

              ))}

            </div>

          )}

        </div>

      </main>
    </>
  );
}