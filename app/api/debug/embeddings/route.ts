import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const chunks = await prisma.chunk.findMany({
      select: {
        id: true,
        chunkIndex: true,
        content: true,
        embedding: true,
      },
      take: 5,
    });

    return NextResponse.json({
      success: true,
      total: chunks.length,
      chunks: chunks.map((chunk) => ({
        id: chunk.id,
        chunkIndex: chunk.chunkIndex,
        contentLength: chunk.content.length,
        hasEmbedding:
          Array.isArray(chunk.embedding) &&
          chunk.embedding.length > 0,
        embeddingLength: Array.isArray(chunk.embedding)
          ? chunk.embedding.length
          : 0,
      })),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Debug failed.",
      },
      {
        status: 500,
      }
    );
  }
}