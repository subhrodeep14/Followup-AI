"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Plus,
  MessageSquare,
  Sparkles,
  Clock3,
} from "lucide-react";

import api from "@/services/api";

type Conversation = {
  id: string;
  title: string;
  createdAt?: string;
};

export default function ChatSidebar() {
  const [conversations, setConversations] = useState<
    Conversation[]
  >([]);

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    try {
      const response = await api.get("/conversations");
      setConversations(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex h-full w-80 flex-col">

      {/* Logo */}
      <div className="border-b border-slate-800 px-6 py-6">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-600/20">
            <Sparkles size={20} />
          </div>

          <div>
            <h2 className="font-bold text-white">
              FollowUp AI
            </h2>

            <p className="text-sm text-slate-400">
              Knowledge Assistant
            </p>
          </div>

        </div>

      </div>

      {/* New Chat */}

      <div className="border-b border-slate-800 p-5">

        <Link
          href="/dashboard/chat"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 font-semibold text-white transition hover:scale-[1.02]"
        >
          <Plus size={18} />

          New Chat
        </Link>

      </div>

      {/* History */}

      <div className="flex-1 overflow-y-auto px-3 py-4">

        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Recent Chats
        </p>

        {conversations.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center">

            <MessageSquare
              size={34}
              className="mx-auto mb-3 text-slate-600"
            />

            <p className="text-sm text-slate-400">
              No conversations yet.
            </p>

          </div>
        ) : (
          conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/dashboard/chat/${conversation.id}`}
              className="group mb-2 block rounded-xl border border-transparent bg-slate-900 p-4 transition-all hover:border-blue-500/40 hover:bg-slate-800"
            >
              <div className="flex items-start gap-3">

                <div className="mt-1 rounded-lg bg-slate-800 p-2 text-blue-400 group-hover:bg-blue-500/20">
                  <MessageSquare size={16} />
                </div>

                <div className="min-w-0 flex-1">

                  <h3 className="truncate font-medium text-white">
                    {conversation.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">

                    <Clock3 size={13} />

                    {conversation.createdAt
                      ? new Date(
                          conversation.createdAt
                        ).toLocaleDateString()
                      : "Recent"}

                  </div>

                </div>

              </div>

            </Link>
          ))
        )}

      </div>

      {/* Footer */}

      <div className="border-t border-slate-800 p-5">

        <div className="rounded-xl bg-slate-900 p-4">

          <p className="text-xs uppercase tracking-wider text-slate-500">
            Documents
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            Upload PDFs, DOCX and TXT files to build your AI
            knowledge base.
          </p>

        </div>

      </div>

    </div>
  );
}