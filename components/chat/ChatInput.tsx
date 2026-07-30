"use client";

import { useRef } from "react";
import { SendHorizonal, Loader2 } from "lucide-react";

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
    textarea.style.height =
      Math.min(textarea.scrollHeight, 180) + "px";
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
    <div className="border-t border-slate-800 bg-slate-950 p-6">

      <div className="mx-auto max-w-5xl">

        <div className="rounded-3xl border border-slate-700 bg-slate-900 shadow-xl">

          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask FollowUp AI anything about your documents..."
            className="max-h-[180px] min-h-[64px] w-full resize-none overflow-y-auto rounded-t-3xl bg-transparent px-6 py-5 text-white placeholder:text-slate-500 focus:outline-none"
          />

          <div className="flex items-center justify-between border-t border-slate-800 px-5 py-4">

            <p className="text-sm text-slate-500">
              Press <span className="font-semibold">Enter</span> to send ·{" "}
              <span className="font-semibold">
                Shift + Enter
              </span>{" "}
              for a new line
            </p>

            <button
              onClick={onSend}
              disabled={loading || !value.trim()}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Thinking...
                </>
              ) : (
                <>
                  <SendHorizonal size={18} />
                  Send
                </>
              )}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}