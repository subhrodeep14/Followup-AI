import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserFromRequest(request);
    const { id } = await params;

    const document = await prisma.document.findFirst({
      where: {
        id,
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

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(document.publicId, {
      resource_type: "raw",
    });

    // Delete chunks
    await prisma.chunk.deleteMany({
      where: {
        documentId: id,
      },
    });

    // Delete document
    await prisma.document.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete document.",
      },
      {
        status: 500,
      }
    );
  }
}