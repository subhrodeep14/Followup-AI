"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  User,
  CalendarDays,
  MessageSquare,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import api from "@/services/api";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
};

export default function ChatConversationPage() {
  const params = useParams();

  const conversationId = params.id as string;

  const [conversation, setConversation] =
    useState<Conversation | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversation();
  }, []);

  async function loadConversation() {
    try {
      const response = await api.get(
        `/conversations/${conversationId}`
      );

      setConversation(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-950">
          <div className="text-center">
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            <p className="text-slate-400">
              Loading conversation...
            </p>
          </div>
        </main>
      </>
    );
  }

  if (!conversation) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-950">
          <div className="text-center">

            <MessageSquare
              size={60}
              className="mx-auto mb-6 text-slate-600"
            />

            <h1 className="text-3xl font-bold text-white">
              Conversation not found
            </h1>

            <p className="mt-3 text-slate-400">
              This conversation may have been deleted.
            </p>

            <Link
              href="/dashboard/chat"
              className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Back to Chat
            </Link>

          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-72px)] bg-slate-950">

        <div className="mx-auto max-w-6xl px-8 py-10">

          {/* Back */}

          <Link
            href="/dashboard/chat/history"
            className="mb-8 inline-flex items-center gap-2 text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to History
          </Link>

          {/* Header */}

          <div className="mb-10 rounded-3xl border border-slate-800 bg-slate-900 p-8">

            <h1 className="text-4xl font-bold text-white">
              {conversation.title}
            </h1>

            <div className="mt-4 flex items-center gap-2 text-slate-400">
              <CalendarDays size={18} />
              Saved Conversation
            </div>

          </div>

          {/* Messages */}

          <div className="space-y-8">

            {conversation.messages.map((message) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  className={`flex ${
                    isUser
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-4xl gap-4 ${
                      isUser
                        ? "flex-row-reverse"
                        : ""
                    }`}
                  >
                    {/* Avatar */}

                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                        isUser
                          ? "bg-blue-600"
                          : "bg-gradient-to-r from-cyan-500 to-blue-600"
                      }`}
                    >
                      {isUser ? (
                        <User
                          size={20}
                          className="text-white"
                        />
                      ) : (
                        <Bot
                          size={20}
                          className="text-white"
                        />
                      )}
                    </div>

                    {/* Bubble */}

                    <div
                      className={`rounded-3xl border p-6 shadow-lg ${
                        isUser
                          ? "border-blue-500/20 bg-blue-600 text-white"
                          : "border-slate-800 bg-slate-900 text-slate-200"
                      }`}
                    >
                      <div className="mb-3">

                        <h3 className="font-semibold">
                          {isUser
                            ? "You"
                            : "FollowUp AI"}
                        </h3>

                        <p className="text-xs opacity-70">
                          {new Date(
                            message.createdAt
                          ).toLocaleString()}
                        </p>

                      </div>

                      <div className="whitespace-pre-wrap leading-8">
                        {message.content}
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}

          </div>

        </div>

      </main>
    </>
  );
}