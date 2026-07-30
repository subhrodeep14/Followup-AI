"use client";

import {
  Bot,
  FileSearch,
  Sparkles,
  FileText,
  ShieldCheck,
} from "lucide-react";

type ChatWelcomeProps = {
  onSuggestionClick: (question: string) => void;
};

const suggestions = [
  {
    title: "Summarize",
    icon: FileText,
    question: "Summarize the uploaded document.",
  },
  {
    title: "Action Items",
    icon: Sparkles,
    question: "Extract all action items from the document.",
  },
  {
    title: "Deadlines",
    icon: FileSearch,
    question: "List every deadline mentioned in the document.",
  },
  {
    title: "Risks",
    icon: ShieldCheck,
    question: "What risks are mentioned in the document?",
  },
];

export default function ChatWelcome({
  onSuggestionClick,
}: ChatWelcomeProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-8">

      {/* Logo */}
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20">
        <Bot size={30} className="text-white" />
      </div>

      {/* Heading */}
      <h1 className="text-center text-3xl font-bold text-white">
        FollowUp AI
      </h1>

      <p className="mt-3 max-w-xl text-center text-sm leading-7 text-slate-400">
        Ask questions about your uploaded documents using AI-powered
        Retrieval-Augmented Generation.
      </p>

      {/* Suggestions */}
      <div className="mt-8 grid w-full grid-cols-2 gap-4">

        {suggestions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              onClick={() => onSuggestionClick(item.question)}
              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 transition hover:border-blue-500/40 hover:bg-slate-800"
            >
              <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
                <Icon size={18} />
              </div>

              <span className="text-sm font-medium text-white">
                {item.title}
              </span>
            </button>
          );
        })}

      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-slate-500">
        Responses are generated only from your uploaded documents.
      </p>

    </div>
  );
}