import { NextRequest, NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { prisma } from "@/lib/prisma";

import { downloadDocument } from "@/lib/storage/downloadDocument";
import { extractText } from "@/lib/extraction/extractText";
import { chunkText } from "@/lib/chunking/chunkText";

export async function POST(request: NextRequest) {
  try {
    const userId = getUserFromRequest(request);

    const body = await request.json();

    const { documentId } = body;

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

    // Update status
    await prisma.document.update({
      where: {
        id: document.id,
      },
      data: {
        status: "PROCESSING",
      },
    });

    // Download PDF
    const buffer = await downloadDocument(document.fileUrl);

    // Extract text
    const extractedText = await extractText(
      buffer,
      document.fileType
    );

    // Chunk text
    const chunks = chunkText(extractedText);

    // Update status
    await prisma.document.update({
      where: {
        id: document.id,
      },
      data: {
        status: "READY",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Document processed successfully.",
      data: {
        extractedCharacters: extractedText.length,
        totalChunks: chunks.length,
        chunks,
      },
    });
  } catch (error) {
    console.error(error);

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