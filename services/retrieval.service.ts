import { prisma } from "@/lib/prisma";
import { generateEmbedding } from "@/lib/embeddings/gemini";
import { cosineSimilarity } from "@/lib/ai/cosineSimilarity";

type SearchResult = {
  id: string;
  content: string;
  score: number;
};

export async function retrieveRelevantChunks(
  question: string,
  topK: number = 5
): Promise<SearchResult[]> {
  // Generate embedding for user's question
  const queryEmbedding = await generateEmbedding(question);

  // Get all chunks
  const chunks = await prisma.chunk.findMany({
    select: {
      id: true,
      content: true,
      embedding: true,
    },
  });

  const results: SearchResult[] = [];

  for (const chunk of chunks) {
    // Skip chunks without embeddings
    if (
      !chunk.embedding ||
      !Array.isArray(chunk.embedding)
    ) {
      continue;
    }

    const embedding = chunk.embedding as number[];

    // Skip invalid vectors
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
    });
  }

  // Highest similarity first
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, topK);
}