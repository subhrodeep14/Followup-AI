"use client";

import { useRef } from "react";
import { Loader2, SendHorizonal } from "lucide-react";

type ChatInputProps = {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
};

export default function ChatInput({
  value,
  loading,
  onChange,
  onSend,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function resizeTextarea() {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      140
    )}px`;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    onChange(e.target.value);
    resizeTextarea();
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (!loading && value.trim()) {
        onSend();
      }
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl transition-all duration-300 focus-within:border-blue-500/50 focus-within:shadow-lg focus-within:shadow-blue-500/10">

      {/* Input */}
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything about your documents..."
        className="max-h-[140px] min-h-[52px] w-full resize-none overflow-y-auto bg-transparent px-5 py-4 text-[15px] leading-6 text-white placeholder:text-slate-500 focus:outline-none"
      />

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3">

        <p className="text-xs text-slate-500">
          Enter ↵ to send · Shift + Enter for new line
        </p>

        <button
          onClick={onSend}
          disabled={loading || !value.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white transition-all duration-200 hover:bg-blue-500 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <SendHorizonal size={18} />
          )}
        </button>

      </div>

    </div>
  );
}