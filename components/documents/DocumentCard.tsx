"use client";

import { FileText, CalendarDays, HardDrive, CheckCircle2 } from "lucide-react";

type DocumentCardProps = {
  title: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  status: string;
};

export default function DocumentCard({
  title,
  fileType,
  fileSize,
  uploadedAt,
  status,
}: DocumentCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10">
      <div className="mb-5 flex items-center justify-between">
        <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
          <FileText size={24} />
        </div>

        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
          {status}
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
          {fileSize}
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays size={16} />
          {uploadedAt}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-2 text-sm text-green-400">
        <CheckCircle2 size={16} />
        Ready for AI Processing
      </div>
    </div>
  );
}