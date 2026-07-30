"use client";

import Link from "next/link";
import { useEffect, useState} from "react";
import {
  Sparkles,
  Plus,
  MessageSquare,
  Clock3,
  Pencil,
  Trash2,
} from "lucide-react";

import api from "@/services/api";

type Conversation = {
  id: string;
  title: string;
  createdAt?: string;
};

export default function ChatSidebar() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

useEffect(() => {
  async function loadConversations() {
    try {
      const response = await api.get("/conversations");
      setConversations(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  void loadConversations();
}, []);

  return (
    <aside className="flex h-full w-72 flex-col border-r border-slate-800 bg-slate-950">

      {/* Header */}
      <div className="border-b border-slate-800 px-5 py-5">

        <div className="mb-5 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500">
            <Sparkles size={18} className="text-white" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">
              FollowUp AI
            </h2>

            <p className="text-xs text-slate-500">
              RAG Assistant
            </p>
          </div>

        </div>

        <Link
          href="/dashboard/chat"
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          <Plus size={16} />
          New Chat
        </Link>

      </div>

      {/* Chats */}
      <div className="flex-1 overflow-y-auto px-3 py-4">

        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Recent Chats
        </p>

        {conversations.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-center">

            <MessageSquare
              size={28}
              className="mx-auto mb-3 text-slate-600"
            />

            <p className="text-sm text-slate-400">
              No conversations yet
            </p>

          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="group mb-2 rounded-xl"
            >
              <Link
                href={`/dashboard/chat/${conversation.id}`}
                className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-900"
              >
                <div className="rounded-lg bg-slate-800 p-2">
                  <MessageSquare
                    size={15}
                    className="text-blue-400"
                  />
                </div>

                <div className="min-w-0 flex-1">

                  <h3 className="truncate text-sm font-medium text-white">
                    {conversation.title}
                  </h3>

                  <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <Clock3 size={11} />
                    {conversation.createdAt
                      ? new Date(
                          conversation.createdAt
                        ).toLocaleDateString()
                      : "Recent"}
                  </div>

                </div>

                {/* Hover Actions */}
                <div className="hidden items-center gap-1 group-hover:flex">

                  <button
                    className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-white"
                    title="Rename"
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    className="rounded-md p-1.5 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>

                </div>

              </Link>
            </div>
          ))
        )}

      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 p-4">

        <p className="text-center text-xs text-slate-500">
          FollowUp AI v1.0
        </p>

      </div>

    </aside>
  );
}