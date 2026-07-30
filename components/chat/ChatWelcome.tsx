"use client";

import {
  Bot,
  FileSearch,
  Sparkles,
  FileText,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

type ChatWelcomeProps = {
  onSuggestionClick: (question: string) => void;
};

const suggestions = [
  {
    title: "Summarize this document",
    description: "Generate a concise summary.",
    icon: FileText,
    question: "Summarize the uploaded document.",
  },
  {
    title: "Extract action items",
    description: "List tasks and owners.",
    icon: Sparkles,
    question: "Extract all action items from the document.",
  },
  {
    title: "Find deadlines",
    description: "Show dates and milestones.",
    icon: FileSearch,
    question: "List every deadline mentioned in the document.",
  },
  {
    title: "Identify risks",
    description: "Highlight potential issues.",
    icon: ShieldCheck,
    question: "What risks are mentioned in the document?",
  },
];

export default function ChatWelcome({
  onSuggestionClick,
}: ChatWelcomeProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center">

      <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 shadow-2xl shadow-blue-600/30">
        <Bot size={42} className="text-white" />
      </div>

      <h1 className="text-center text-5xl font-bold tracking-tight text-white">
        FollowUp AI
      </h1>

      <p className="mt-4 max-w-3xl text-center text-lg leading-8 text-slate-400">
        Upload documents and ask questions naturally.
        Your answers are generated using Retrieval-Augmented
        Generation (RAG) powered by Gemini AI.
      </p>

      <div className="mt-14 grid w-full max-w-5xl gap-5 md:grid-cols-2">

        {suggestions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              onClick={() =>
                onSuggestionClick(item.question)
              }
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-slate-800 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="flex items-start justify-between">

                <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                  <Icon size={24} />
                </div>

                <ArrowUpRight
                  size={18}
                  className="text-slate-600 transition group-hover:text-blue-400"
                />

              </div>

              <h2 className="mt-5 text-xl font-semibold text-white">
                {item.title}
              </h2>

              <p className="mt-2 leading-7 text-slate-400">
                {item.description}
              </p>

            </button>
          );
        })}

      </div>

      <div className="mt-12 rounded-2xl border border-blue-500/20 bg-blue-500/5 px-6 py-5">

        <p className="text-center text-sm leading-7 text-blue-300">
          Your answers are generated only from the uploaded
          documents. If information is missing, FollowUp AI
          will tell you instead of inventing facts.
        </p>

      </div>

    </div>
  );
}