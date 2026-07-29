import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

import { downloadDocument } from "@/lib/storage/downloadDocument";
import { extractText } from "@/lib/extraction/extractText";
import { chunkText } from "@/lib/chunking/chunkText";

export async function POST(request: NextRequest) {
  try {
    const userId = getUserFromRequest(request);

    const { documentId } = await request.json();

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

    await prisma.document.update({
      where: {
        id: document.id,
      },
      data: {
        status: "PROCESSING",
        processingError: null,
      },
    });

    // Download document
    const buffer = await downloadDocument(document.fileUrl);

    // Extract text
    const extractedText = await extractText(
      buffer,
      document.fileType
    );

    // Save extracted text
    await prisma.document.update({
      where: {
        id: document.id,
      },
      data: {
        extractedText,
      },
    });

    // Create chunks
    const chunks = chunkText(extractedText);

    // Remove old chunks (allows reprocessing)
    await prisma.chunk.deleteMany({
      where: {
        documentId: document.id,
      },
    });

    // Save chunks
    await prisma.chunk.createMany({
      data: chunks.map((chunk) => ({
        documentId: document.id,
        chunkIndex: chunk.chunkIndex,
        content: chunk.content,
      })),
    });

    // Mark as ready
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

    // Try to mark the document as failed
    try {
      const body = await request.clone().json();

      if (body.documentId) {
        await prisma.document.update({
          where: {
            id: body.documentId,
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
    } catch {}

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