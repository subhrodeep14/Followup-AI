"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import UploadButton from "@/components/documents/UploadButton";
import DocumentCard from "@/components/documents/DocumentCard";

type Document = {
  id: string;
  title: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  status: string;
};

export default function DocumentsClient() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/documents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setDocuments(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleFileSelect(file: File) {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first.");
        return;
      }

      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      toast.loading("Uploading document...", {
        id: "upload",
      });

      // Upload document
      const uploadResponse = await fetch("/api/documents/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        toast.error(uploadData.message, {
          id: "upload",
        });
        return;
      }

      toast.loading("Processing document...", {
        id: "upload",
      });

      // Process document
      const processResponse = await fetch(
        "/api/documents/process",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            documentId: uploadData.data.id,
          }),
        }
      );

      const processData = await processResponse.json();

      if (!processResponse.ok) {
        toast.error(processData.message, {
          id: "upload",
        });
        return;
      }

      await loadDocuments();

      toast.success("Document processed successfully!", {
        id: "upload",
      });
    } catch (error) {
      console.error(error);

      toast.error("Upload failed.", {
        id: "upload",
      });
    } finally {
      setUploading(false);
    }
  }

  const readyDocuments = documents.filter(
    (doc) => doc.status === "READY"
  ).length;

  return (
    <>
      {/* Hero */}
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            📄 Knowledge Base
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-white">
            Documents
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
            Upload documents that will power your AI knowledge base.
            Contracts, meeting notes, proposals and reports will later
            be searchable using Retrieval-Augmented Generation (RAG).
          </p>
        </div>

        <UploadButton
          uploading={uploading}
          onFileSelect={handleFileSelect}
        />
      </div>

      {/* Stats */}
      <div className="mb-10 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Total Documents
          </p>

          <h2 className="mt-2 text-4xl font-bold text-white">
            {documents.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Ready Documents
          </p>

          <h2 className="mt-2 text-4xl font-bold text-green-400">
            {readyDocuments}
          </h2>
        </div>
      </div>

      {/* Documents */}
      <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
        {documents.map((document) => (
          <DocumentCard
            key={document.id}
            id={document.id}
            title={document.title}
            fileType={document.fileType}
            fileSize={document.fileSize}
            uploadedAt={document.createdAt}
            status={document.status}
            onDelete={loadDocuments}
          />
        ))}
      </div>
    </>
  );
}