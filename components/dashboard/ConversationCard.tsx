"use client";

import Link from "next/link";
import {
  Trash2,
  ArrowUpRight,
  Sparkles,
  CalendarDays,
  User,
} from "lucide-react";

import api from "@/services/api";
import { toast } from "sonner";

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

      await onDelete?.();

      toast.success("Conversation deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete conversation.");
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10">

      {/* Gradient Top Border */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500" />

      <div className="p-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0 flex-1">

            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                <Sparkles className="mr-1 inline h-3 w-3" />
                AI Analysis
              </span>
            </div>

            <Link href={`/dashboard/${id}`}>
              <h2 className="line-clamp-2 cursor-pointer text-xl font-bold text-white transition group-hover:text-blue-400">
                {title}
              </h2>
            </Link>

            {clientName && (
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                <User size={15} />
                <span>{clientName}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500 hover:text-white"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Summary */}
        <Link href={`/dashboard/${id}`}>
          <div className="mt-6 cursor-pointer">

            <p className="line-clamp-4 leading-7 text-slate-300">
              {summary}
            </p>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CalendarDays size={15} />
                {new Date(createdAt).toLocaleDateString()}
              </div>

              <div className="flex items-center gap-1 text-sm font-medium text-blue-400 transition group-hover:gap-2">
                View
                <ArrowUpRight size={16} />
              </div>

            </div>

          </div>
        </Link>

      </div>
    </div>
  );
}