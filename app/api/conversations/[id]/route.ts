import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const userId = getUserFromRequest(req);
    const { id } = await params;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        analysis: true,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        {
          success: false,
          message: "Conversation not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: conversation,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const userId = getUserFromRequest(req);
    const { id } = await params;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        {
          success: false,
          message: "Conversation not found",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.conversation.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Conversation deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}