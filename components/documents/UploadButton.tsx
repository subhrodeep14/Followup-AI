"use client";

import { Upload } from "lucide-react";

type UploadButtonProps = {
  onFileSelect: (file: File) => void;
};

export default function UploadButton({
  onFileSelect,
}: UploadButtonProps) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    onFileSelect(file);
  }

  return (
    <>
      <input
        id="document-upload"
        type="file"
        accept=".pdf,.txt,.doc,.docx"
        className="hidden"
        onChange={handleChange}
      />

      <label
        htmlFor="document-upload"
        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30"
      >
        <Upload size={18} />
        Upload Document
      </label>
    </>
  );
}