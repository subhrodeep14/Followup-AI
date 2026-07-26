"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

type CopyButtonProps = {
  text: string;
};

export default function CopyButton({
  text,
}: CopyButtonProps) {
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);

      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy.");
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
    >
      <Copy size={16} />
      Copy
    </button>
  );
}