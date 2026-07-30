import { NextRequest, NextResponse } from "next/server";



import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

import { downloadDocument } from "@/lib/storage/downloadDocument";
import { extractText } from "@/lib/extraction/extractText";
import { chunkText } from "@/lib/chunking/chunkText";

import { generateAndStoreEmbeddings } from "@/services/embedding.service";

export async function POST(request: NextRequest) {
  let documentId = "";

  try {
    const userId = getUserFromRequest(request);

    const body = await request.json();

    documentId = body.documentId;

    if (!documentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Document ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId,
      },
    });

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          message: "Document not found.",
        },
        {
          status: 404,
        }
      );
    }

    console.log("Downloading document...");

    await prisma.document.update({
      where: {
        id: document.id,
      },
     data: {
  status: "PROCESSING",
  processingError: null,
},
    });

    // -------------------------
    // Download
    // -------------------------

    const buffer = await downloadDocument(document.fileUrl);

    console.log("Extracting text...");

    // -------------------------
    // Extract Text
    // -------------------------

    const extractedText = await extractText(
      buffer,
      document.fileType
    );

    await prisma.document.update({
      where: {
        id: document.id,
      },
      data: {
        extractedText,
      },
    });

    console.log("Chunking document...");

    // -------------------------
    // Chunk
    // -------------------------

    const chunks = chunkText(extractedText);

    await prisma.chunk.deleteMany({
      where: {
        documentId: document.id,
      },
    });

    await prisma.chunk.createMany({
      data: chunks.map((chunk) => ({
        documentId: document.id,
        chunkIndex: chunk.chunkIndex,
        content: chunk.content,
      })),
    });

    console.log("Generating embeddings...");

    // -------------------------
    // Embeddings
    // -------------------------

    await generateAndStoreEmbeddings(document.id);

    console.log("Embeddings completed.");

    // -------------------------
    // Finish
    // -------------------------

    await prisma.document.update({
      where: {
        id: document.id,
      },
      data: {
        status: "READY",
        processedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Document processed successfully.",
      data: {
        documentId: document.id,
        extractedCharacters: extractedText.length,
        totalChunks: chunks.length,
      },
    });
  } catch (error) {
    console.error(error);

    if (documentId) {
      await prisma.document.update({
        where: {
          id: documentId,
        },
        data: {
          status: "FAILED",
          processingError:
            error instanceof Error
              ? error.message
              : "Unknown processing error",
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Processing failed.",
      },
      {
        status: 500,
      }
    );
  }
}