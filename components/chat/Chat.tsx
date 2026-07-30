"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import ChatSidebar from "./ChatSidebar";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import ChatWelcome from "./ChatWelcome";
import api from "@/services/api";
import { toast } from "sonner";

type Citation = {
  chunkId: string;
  score: number;
  preview: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<
    string | undefined
  >(undefined);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function sendMessage() {
    const question = input.trim();

    if (!question || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/chat", {
        question,
        conversationId,
      });

      const data = response.data;

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.answer,
        citations: data.citations,
      };

      setConversationId(data.conversationId);

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);

      toast.error("Failed to get AI response.");

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Sorry, something went wrong while generating the response.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white">
  {/* Sidebar */}
  <aside className="hidden w-80 border-r border-slate-800 bg-slate-900 lg:flex">
    <ChatSidebar />
  </aside>

  {/* Main */}
  <div className="flex flex-1 flex-col overflow-hidden">
    <Navbar />

    <main className="relative flex-1 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[180px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[170px]" />
        <div className="absolute bottom-20 left-20 h-[250px] w-[250px] rounded-full bg-indigo-500/5 blur-[130px]" />
    </div>

      <div className="relative flex h-full flex-col">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center px-6">
              <ChatWelcome
                onSuggestionClick={(question) => {
                  setInput(question);
                }}
              />
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  citations={message.citations}
                />
              ))}

              {loading && (
                <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 px-5 py-4 backdrop-blur-xl shadow-lg">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" />
                  </div>

                  <span className="text-sm text-slate-400">
                    Searching your knowledge base...
                  </span>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Floating Chat Input */}
        <div className="sticky bottom-0 px-6 pb-6">
          <div className="mx-auto max-w-3xl">

            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl">

              <ChatInput
                value={input}
                loading={loading}
                onChange={setInput}
                onSend={sendMessage}
              />

            </div>

            <p className="mt-3 text-center text-xs text-slate-500">
              FollowUp AI can make mistakes. Always verify important information.
            </p>

          </div>
        </div>

      </div>
    </main>
  </div>
</div>
  );
}