import { prisma } from "@/lib/prisma";
import { generateEmbedding } from "@/lib/embeddings/gemini";
import { cosineSimilarity } from "@/lib/ai/cosineSimilarity";

type SearchResult = {
  id: string;
  content: string;
  score: number;
  fileName: string;
  documentTitle: string;
};

export async function retrieveRelevantChunks(
  question: string,
  userId: string,
  topK: number = 5
): Promise<SearchResult[]> {
  // Generate embedding for the user's question
  const queryEmbedding = await generateEmbedding(question);

  // Only retrieve chunks belonging to the current user's processed documents
  const chunks = await prisma.chunk.findMany({
    where: {
      document: {
        userId,
        status: "READY",
      },
    },
    select: {
      id: true,
      content: true,
      embedding: true,
      document: {
        select: {
          fileName: true,
          title: true,
        },
      },
    },
  });

  const results: SearchResult[] = [];

  for (const chunk of chunks) {
    // Skip chunks without embeddings
    if (!chunk.embedding || !Array.isArray(chunk.embedding)) {
      continue;
    }

    const embedding = chunk.embedding as number[];

    // Skip invalid embeddings
    if (embedding.length !== queryEmbedding.length) {
      continue;
    }

    const score = cosineSimilarity(
      queryEmbedding,
      embedding
    );

    results.push({
      id: chunk.id,
      content: chunk.content,
      score,
      fileName: chunk.document.fileName,
      documentTitle: chunk.document.title,
    });
  }

  // Remove duplicate chunks (same content)
  const uniqueResults = Array.from(
    new Map(
      results.map((result) => [result.content, result])
    ).values()
  );

  // Highest similarity first
  uniqueResults.sort((a, b) => b.score - a.score);

  return uniqueResults.slice(0, topK);
}