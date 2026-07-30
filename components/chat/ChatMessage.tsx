"use client";

import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
    isUser
      ? "bg-blue-600"
      : "bg-gradient-to-br from-cyan-500 to-blue-600"
  } shadow-lg`}
>
  {isUser ? (
    <User size={18} className="text-white" />
  ) : (
    <Bot size={18} className="text-white" />
  )}
</div>
        

        {/* Bubble */}

      <div
  className={`relative rounded-2xl border px-6 py-5 shadow-lg transition-all duration-300 ${
    isUser
      ? "border-blue-500/20 bg-blue-600 text-white"
      : "border-slate-800 bg-slate-900/90 backdrop-blur-xl"
  }`}
>
          {/* Header */}

          <div className="mb-5 flex items-center justify-between">

  <div>

    <h3 className="text-sm font-semibold text-white">
      {isUser ? "You" : "FollowUp AI"}
    </h3>

    <p className="mt-1 text-xs text-slate-400">
      {isUser ? "Question" : "AI Response"}
    </p>

  </div>

  <button
    onClick={copyMessage}
    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
  >
    {copied ? (
      <Check size={16} />
    ) : (
      <Copy size={16} />
    )}
  </button>

</div>

          {/* Content */}

        <div
  className="
    prose
    prose-invert
    max-w-none

    prose-headings:text-white
    prose-p:text-slate-200
    prose-p:leading-8

    prose-strong:text-white

    prose-ul:my-3
    prose-ol:my-3
    prose-li:my-2

    prose-code:rounded
    prose-code:bg-slate-800
    prose-code:px-1.5
    prose-code:py-1
    prose-code:text-cyan-400

    prose-pre:rounded-xl
    prose-pre:border
    prose-pre:border-slate-700
    prose-pre:bg-slate-950

    prose-a:text-blue-400
  "
>
  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {content}
  </ReactMarkdown>
</div>

          {/* Citations */}

          {!isUser && citations.length > 0 && (
            <div className="mt-8 border-t border-slate-800 pt-6">

  <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
    Sources
  </p>

  <div className="space-y-3">

    {citations.map((citation, index) => (
      <div
        key={citation.chunkId}
        className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-blue-500/30"
      >

        <div className="mb-3 flex items-center justify-between">

          <span className="text-sm font-medium text-white">
            Source {index + 1}
          </span>

          <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400">
            {(citation.score * 100).toFixed(0)}%
          </span>

        </div>

        <p className="text-sm leading-7 text-slate-400">
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