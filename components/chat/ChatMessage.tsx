"use client";

import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";

type Citation = {
  chunkId: string;
  score: number;
  preview: string;
};

type ChatMessageProps = {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
};

export default function ChatMessage({
  role,
  content,
  citations = [],
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  async function copyMessage() {
    await navigator.clipboard.writeText(content);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  const isUser = role === "user";

  return (
    <div
      className={`flex w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-4xl gap-4 ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        {/* Avatar */}

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
            isUser
              ? "bg-blue-600"
              : "bg-gradient-to-r from-cyan-500 to-blue-600"
          }`}
        >
          {isUser ? (
            <User size={20} className="text-white" />
          ) : (
            <Bot size={20} className="text-white" />
          )}
        </div>

        {/* Bubble */}

        <div
          className={`rounded-3xl border p-5 shadow-lg ${
            isUser
              ? "border-blue-500/20 bg-blue-600 text-white"
              : "border-slate-800 bg-slate-900 text-slate-200"
          }`}
        >
          {/* Header */}

          <div className="mb-4 flex items-center justify-between gap-6">
            <div>

              <h3 className="font-semibold">
                {isUser ? "You" : "FollowUp AI"}
              </h3>

              <p className="text-xs opacity-70">
                {isUser
                  ? "Question"
                  : "AI Response"}
              </p>

            </div>

            <button
              onClick={copyMessage}
              className="rounded-lg p-2 transition hover:bg-white/10"
            >
              {copied ? (
                <Check size={16} />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>

          {/* Content */}

          <div className="whitespace-pre-wrap leading-8">
            {content}
          </div>

          {/* Citations */}

          {!isUser && citations.length > 0 && (
            <div className="mt-8 border-t border-slate-700 pt-5">

              <p className="mb-4 text-sm font-semibold text-slate-400">
                Sources
              </p>

              <div className="space-y-3">

                {citations.map((citation, index) => (
                  <div
                    key={citation.chunkId}
                    className="rounded-xl border border-slate-700 bg-slate-800 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">

                      <span className="text-sm font-medium text-white">
                        Source {index + 1}
                      </span>

                      <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                        {(citation.score * 100).toFixed(1)}%
                      </span>

                    </div>

                    <p className="line-clamp-3 text-sm leading-7 text-slate-400">
                      {citation.preview}
                    </p>

                  </div>
                ))}

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}