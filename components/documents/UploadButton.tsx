"use client";

import { ChangeEvent } from "react";
import { Loader2, Upload } from "lucide-react";

type UploadButtonProps = {
  onFileSelect: (file: File) => void;
  uploading: boolean;
};

export default function UploadButton({
  onFileSelect,
  uploading,
}: UploadButtonProps) {
  function handleChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    onFileSelect(file);

    // Reset input so the same file can be selected again
    event.target.value = "";
  }

  return (
    <>
      <input
        id="document-upload"
        type="file"
        accept=".pdf,.txt,.doc,.docx"
        className="hidden"
        disabled={uploading}
        onChange={handleChange}
      />

      <label
        htmlFor={uploading ? undefined : "document-upload"}
        className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-white transition
          ${
            uploading
              ? "cursor-not-allowed bg-slate-700 opacity-70"
              : "cursor-pointer bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30"
          }`}
      >
        {uploading ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
            />
            Uploading...
          </>
        ) : (
          <>
            <Upload size={18} />
            Upload Document
          </>
        )}
      </label>
    </>
  );
}