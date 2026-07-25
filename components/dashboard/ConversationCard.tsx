"use client";

import Link from "next/link";
import api from "@/services/api";

type ConversationCardProps = {
  id: string;
  title: string;
  clientName?: string | null;
  summary: string;
  createdAt: string;
  onDelete?: () => Promise<void> | void;
};

export default function ConversationCard({
  id,
  title,
  clientName,
  summary,
  createdAt,
  onDelete,
}: ConversationCardProps) {
  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this conversation?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/conversations/${id}`);

      if (onDelete) {
        await onDelete();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete conversation.");
    }
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-600 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link href={`/dashboard/${id}`}>
            <h2 className="cursor-pointer text-xl font-semibold text-white hover:underline">
              {title}
            </h2>
          </Link>

          {clientName && (
            <p className="mt-1 text-sm text-slate-400">
              Client: {clientName}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleDelete}
          className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Delete
        </button>
      </div>

      <Link href={`/dashboard/${id}`}>
        <div className="cursor-pointer">
          <p className="mt-4 line-clamp-3 text-slate-300">
            {summary}
          </p>

          <p className="mt-4 text-xs text-slate-500">
            {new Date(createdAt).toLocaleString()}
          </p>
        </div>
      </Link>
    </div>
  );
}