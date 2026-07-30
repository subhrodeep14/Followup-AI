import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { generateEmbedding } from "@/lib/embeddings/gemini";

export async function generateAndStoreEmbeddings(
  documentId: string
) {
  const chunks = await prisma.chunk.findMany({
    where: {
      documentId,
    },
    orderBy: {
      chunkIndex: "asc",
    },
  });

  console.log("==================================");
  console.log("Embedding Service Started");
  console.log("Total Chunks:", chunks.length);
  console.log("==================================");

  for (const chunk of chunks) {
    console.log(
      "Generating embedding for chunk:",
      chunk.chunkIndex
    );

    const embedding = await generateEmbedding(chunk.content);

    console.log(
      "Embedding length:",
      embedding.length
    );

    await prisma.chunk.update({
      where: {
        id: chunk.id,
      },
      data: {
        embedding,
      },
    });

    console.log(
      "Saved embedding for chunk:",
      chunk.chunkIndex
    );
  }

  console.log("Embedding Service Finished");
}

export async function getDocumentEmbeddings(
  documentId: string
) {
  return prisma.chunk.findMany({
    where: {
      documentId,
    },
    orderBy: {
      chunkIndex: "asc",
    },
    select: {
      id: true,
      content: true,
      embedding: true,
    },
  });
}

export async function deleteEmbeddings(
  documentId: string
) {
  await prisma.chunk.updateMany({
    where: {
      documentId,
    },
    data: {
      embedding: Prisma.JsonNull,
    },
  });
}