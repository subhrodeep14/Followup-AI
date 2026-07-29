"use client";

import {
  FileText,
  CalendarDays,
  HardDrive,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock3,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type DocumentCardProps = {
  id: string;
  title: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  status: string;
  onDelete: () => Promise<void>;
};

export default function DocumentCard({
  id,
  title,
  fileType,
  fileSize,
  uploadedAt,
  status,
  onDelete,
}: DocumentCardProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this document?")) return;

    try {
      setDeleting(true);

      const token = localStorage.getItem("token");

      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

     await onDelete();

toast.success("Document deleted");
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  const statusMap = {
    UPLOADED: {
      color: "bg-blue-500/10 text-blue-400",
      icon: <Clock3 size={16} />,
      text: "Uploaded",
    },
    PROCESSING: {
      color: "bg-yellow-500/10 text-yellow-400",
      icon: <Loader2 size={16} className="animate-spin" />,
      text: "Processing",
    },
    READY: {
      color: "bg-green-500/10 text-green-400",
      icon: <CheckCircle2 size={16} />,
      text: "Ready",
    },
    FAILED: {
      color: "bg-red-500/10 text-red-400",
      icon: <AlertCircle size={16} />,
      text: "Failed",
    },
  } as const;

  const current =
    statusMap[status as keyof typeof statusMap] ??
    statusMap.UPLOADED;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10">
      <div className="mb-5 flex items-center justify-between">
        <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
          <FileText size={24} />
        </div>

        <span
          className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${current.color}`}
        >
          {current.icon}
          {current.text}
        </span>
      </div>

      <h3 className="truncate text-lg font-semibold text-white">
        {title}
      </h3>

      <div className="mt-5 space-y-3 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <FileText size={16} />
          {fileType}
        </div>

        <div className="flex items-center gap-2">
          <HardDrive size={16} />
          {(fileSize / 1024).toFixed(1)} KB
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays size={16} />
          {new Date(uploadedAt).toLocaleString()}
        </div>
      </div>

      <div
        className={`mt-6 flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${current.color}`}
      >
        {current.icon}
        {current.text}
      </div>

      <button
        onClick={handleDelete}
        disabled={deleting}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-2 font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
      >
        {deleting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Deleting...
          </>
        ) : (
          <>
            <Trash2 size={16} />
            Delete
          </>
        )}
      </button>
    </div>
  );
}