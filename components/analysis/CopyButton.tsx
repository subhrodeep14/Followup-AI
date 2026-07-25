"use client";

import { useState } from "react";

type CopyButtonProps = {
  text: string;
};

export default function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium transition hover:bg-slate-100 hover:text-slate-900"
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}