import { NextRequest, NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { getDocuments } from "@/services/document.service";

export async function GET(request: NextRequest) {
  try {
    const userId = getUserFromRequest(request);

    const documents = await getDocuments(userId);

    return NextResponse.json(
      {
        success: true,
        data: documents,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Get Documents Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch documents.",
      },
      {
        status: 500,
      }
    );
  }
}