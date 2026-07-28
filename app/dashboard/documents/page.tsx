import Navbar from "@/components/layout/Navbar";
import DocumentsClient from "@/components/documents/DocumentsClient";

export default function DocumentsPage() {
  return (
    <>
      <Navbar />

      <main className="mx-auto min-h-screen max-w-7xl px-6 py-10">
        <DocumentsClient />
      </main>
    </>
  );
}