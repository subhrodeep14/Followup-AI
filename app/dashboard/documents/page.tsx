import Navbar from "@/components/layout/Navbar";
import UploadButton from "@/components/documents/UploadButton";
import DocumentCard from "@/components/documents/DocumentCard";

const documents = [
  {
    id: "1",
    title: "Client Proposal.pdf",
    fileType: "PDF",
    fileSize: "2.3 MB",
    uploadedAt: "Today",
    status: "Uploaded",
  },
  {
    id: "2",
    title: "Meeting Notes.pdf",
    fileType: "PDF",
    fileSize: "1.1 MB",
    uploadedAt: "Yesterday",
    status: "Uploaded",
  },
  {
    id: "3",
    title: "Project Requirements.pdf",
    fileType: "PDF",
    fileSize: "3.8 MB",
    uploadedAt: "2 days ago",
    status: "Uploaded",
  },
];

export default function DocumentsPage() {
  return (
    <>
      <Navbar />

      <main className="mx-auto min-h-screen max-w-7xl px-6 py-10">
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
              Contracts, meeting notes, proposals and reports will later be
              searchable using Retrieval-Augmented Generation (RAG).
            </p>
          </div>

          <UploadButton />
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
              Status
            </p>

            <h2 className="mt-2 text-2xl font-bold text-green-400">
              Ready
            </h2>
          </div>
        </div>

        {/* Document Grid */}
        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              title={document.title}
              fileType={document.fileType}
              fileSize={document.fileSize}
              uploadedAt={document.uploadedAt}
              status={document.status}
            />
          ))}
        </div>
      </main>
    </>
  );
}