import { NextRequest, NextResponse } from "next/server";

import getCloudinary from "@/lib/storage/cloudinary";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { createDocument } from "@/services/document.service";

export async function POST(request: NextRequest) {
  try {
    // Get logged in user
    const userId = getUserFromRequest(request);

    const formData = await request.formData();

    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No file uploaded.",
        },
        {
          status: 400,
        }
      );
    }

    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Unsupported file type.",
        },
        {
          status: 400,
        }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const cloudinary = getCloudinary();

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "followup-ai/documents",
            resource_type: "raw",
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }

            resolve(result);
          }
        )
        .end(buffer);
    });

    const document = await createDocument({
      title: file.name.replace(/\.[^/.]+$/, ""),
      fileName: file.name,
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      fileType: file.type,
      fileSize: file.size,
      userId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Document uploaded successfully.",
        data: document,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Document Upload Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Upload failed.",
      },
      {
        status: 500,
      }
    );
  }
}