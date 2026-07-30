"use client";

import Navbar from "@/components/layout/Navbar";
import Chat from "@/components/chat/Chat";
import ChatSidebar from "@/components/chat/ChatSidebar";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-slate-950">

      {/* Global Navbar */}
      <Navbar />

      <main className="h-[calc(100vh-72px)]">

        <div className="mx-auto flex h-full max-w-[1700px]">

          {/* Sidebar */}
          <aside className="hidden border-r border-slate-800 bg-slate-900/70 backdrop-blur lg:flex">
            <ChatSidebar />
          </aside>

          {/* Main */}
          <section className="flex flex-1 flex-col">

            {/* Header */}
            <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">

              <div className="px-8 py-7">

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
                  🤖 AI Knowledge Assistant
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-white">
                  Chat with your documents
                </h1>

                <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-400">
                  Ask questions about PDFs, DOCX and TXT files.
                  FollowUp AI retrieves the most relevant document
                  chunks using Retrieval-Augmented Generation before
                  answering.
                </p>

              </div>

            </div>

            {/* Chat */}
            <div className="flex-1 overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 px-8 py-8">
              <Chat />
            </div>

          </section>

        </div>

      </main>

    </div>
  );
}