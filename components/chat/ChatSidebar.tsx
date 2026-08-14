"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles,
  Plus,
  MessageSquare,
  Clock3,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/services/api";

type Conversation = {
  id: string;
  title: string;
  createdAt?: string;
};

export default function ChatSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [conversations, setConversations] = useState<
    Conversation[]
  >([]);

  const [creating, setCreating] = useState(false);

  useEffect(() => {
    void loadConversations();
  }, [pathname]);

  async function loadConversations() {
    try {
      const response = await api.get("/conversations");

      setConversations(response.data.data ?? []);
    } catch (error) {
      console.error(
        "Failed to load conversations:",
        error
      );
    }
  }

  async function handleNewChat() {
    if (creating) return;

    try {
      setCreating(true);

      const response = await api.post(
        "/conversations",
        {
          title: "New Chat",
        }
      );

      const conversationId =
        response.data?.data?.id;

      if (!conversationId) {
        throw new Error(
          "Conversation ID was not returned."
        );
      }

      // Refresh sidebar data
      await loadConversations();

      // Open the newly created conversation
      router.push(
        `/dashboard/chat/${conversationId}`
      );
    } catch (error) {
      console.error(
        "Failed to create conversation:",
        error
      );

      toast.error("Unable to create a new chat.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(
    conversationId: string
  ) {
    const confirmed = window.confirm(
      "Delete this conversation?"
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/conversations/${conversationId}`
      );

      setConversations((prev) =>
        prev.filter(
          (conversation) =>
            conversation.id !== conversationId
        )
      );

      // If currently viewing deleted chat,
      // return to chat home.
      if (
        pathname ===
        `/dashboard/chat/${conversationId}`
      ) {
        router.push("/dashboard/chat");
      }

      toast.success("Conversation deleted.");
    } catch (error) {
      console.error(
        "Failed to delete conversation:",
        error
      );

      toast.error(
        "Unable to delete conversation."
      );
    }
  }

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-950">

      {/* Header */}

      <div className="border-b border-slate-800 px-5 py-5">

        <div className="mb-5 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-600/20">
            <Sparkles
              size={18}
              className="text-white"
            />
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

        {/* New Chat */}

        <button
          type="button"
          onClick={handleNewChat}
          disabled={creating}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-500 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {creating ? (
            <>
              <Loader2
                size={16}
                className="animate-spin"
              />
              Creating...
            </>
          ) : (
            <>
              <Plus size={16} />
              New Chat
            </>
          )}
        </button>

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

            <p className="mt-1 text-xs text-slate-600">
              Start a new chat above
            </p>

          </div>
        ) : (
          conversations.map(
            (conversation) => {
              const active =
                pathname ===
                `/dashboard/chat/${conversation.id}`;

              return (
                <div
                  key={conversation.id}
                  className={`group mb-2 rounded-xl ${
                    active
                      ? "bg-slate-900"
                      : ""
                  }`}
                >

                  <div className="flex items-center">

                    <Link
                      href={`/dashboard/chat/${conversation.id}`}
                      className="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-3 transition hover:bg-slate-900"
                    >

                      <div
                        className={`rounded-lg p-2 ${
                          active
                            ? "bg-blue-500/10"
                            : "bg-slate-800"
                        }`}
                      >
                        <MessageSquare
                          size={15}
                          className={
                            active
                              ? "text-blue-400"
                              : "text-slate-500"
                          }
                        />
                      </div>

                      <div className="min-w-0 flex-1">

                        <h3
                          className={`truncate text-sm font-medium ${
                            active
                              ? "text-white"
                              : "text-slate-300"
                          }`}
                        >
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

                    </Link>

                    {/* Actions */}

                    <div className="mr-2 hidden items-center gap-1 group-hover:flex">

                      <button
                        type="button"
                        onClick={() => {
                          toast.info(
                            "Rename will be added next."
                          );
                        }}
                        className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-white"
                        title="Rename"
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            conversation.id
                          )
                        }
                        className="rounded-md p-1.5 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>

                    </div>

                  </div>

                </div>
              );
            }
          )
        )}

      </div>

      {/* Footer */}

      <div className="border-t border-slate-800 p-4">

        <p className="text-center text-xs text-slate-600">
          FollowUp AI v1.0
        </p>

      </div>

    </aside>
  );
}