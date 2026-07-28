"use client";

import { Upload } from "lucide-react";

type UploadButtonProps = {
  onClick?: () => void;
};

export default function UploadButton({
  onClick,
}: UploadButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30"
    >
      <Upload size={18} />
      Upload Document
    </button>
  );
}