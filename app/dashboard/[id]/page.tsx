"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import AnalysisCard from "@/components/analysis/AnalysisCard";
import api from "@/services/api";
 import { Conversation } from "@/types/conversation";
export default function AnalysisPage() {
  const { id } = useParams();

 

const [conversation, setConversation] =
    useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchConversation() {
      try {
        const response = await api.get(`/conversations/${id}`);

        setConversation(response.data.data);
      } catch (err: unknown) {
        setError(
          (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to load conversation."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchConversation();
  }, [id]);

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-10">

        {loading && (
          <p className="text-center text-slate-500">
            Loading...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500">
            {error}
          </p>
        )}

        {!loading && !error && conversation && (
          <AnalysisCard conversation={conversation} />
        )}

      </main>
    </>
  );
}