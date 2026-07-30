"use client";

import Link from "next/link";
import {
  Bot,
  FileText,
  Sparkles,
  MessageSquare,
} from "lucide-react";

type ChatHeaderProps = {
  totalDocuments?: number;
};

export default function ChatHeader({
  totalDocuments = 0,
}: ChatHeaderProps) {
  return (
    <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">

      <div className="flex flex-col gap-6 px-8 py-6 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}

        <div>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            <Sparkles size={15} />
            AI Knowledge Assistant
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white">
            Chat with your documents
          </h1>

          <p className="mt-3 max-w-3xl text-slate-400 leading-7">
            Ask questions about your uploaded PDFs, DOCX and TXT
            files. FollowUp AI retrieves the most relevant document
            chunks before generating an answer.
          </p>

        </div>

        {/* Right */}

        <div className="flex gap-4">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                <FileText size={20} />
              </div>

              <div>

                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Documents
                </p>

                <h2 className="text-2xl font-bold text-white">
                  {totalDocuments}
                </h2>

              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-green-500/10 p-3 text-green-400">
                <Bot size={20} />
              </div>

              <div>

                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Status
                </p>

                <h2 className="text-lg font-semibold text-green-400">
                  Ready
                </h2>

              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="flex items-center gap-6 border-t border-slate-800 px-8 py-4 text-sm">

        <Link
          href="/dashboard/documents"
          className="flex items-center gap-2 text-slate-400 transition hover:text-white"
        >
          <FileText size={16} />
          Documents
        </Link>

        <Link
          href="/dashboard/chat/history"
          className="flex items-center gap-2 text-slate-400 transition hover:text-white"
        >
          <MessageSquare size={16} />
          Chat History
        </Link>

      </div>

    </div>
  );
}