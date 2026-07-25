import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { conversationSchema } from "@/lib/validations";
import { generateAnalysis } from "@/lib/ai/gemini";

export async function GET(req: NextRequest) {
  try {
    const userId = getUserFromRequest(req);

    const conversations = await prisma.conversation.findMany({
      where: {
        userId,
      },
      include: {
        analysis: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: conversations,
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

export async function POST(req: NextRequest) {
  try {
    const userId = getUserFromRequest(req);

    const body = await req.json();

    const result = conversationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        {
          status: 400,
        }
      );
    }

    const { title, clientName, rawInput } = result.data;

    const analysis = await generateAnalysis(rawInput);

    const conversation = await prisma.conversation.create({
  data: {
    title,
    clientName: clientName || null,
    rawInput,
    userId,
  },
});

await prisma.analysis.create({
  data: {
    conversationId: conversation.id,
    summary: analysis.summary,
    actionItems: analysis.actionItems,
    openQuestions: analysis.openQuestions,
    draftEmail: analysis.draftEmail,
    riskFlags: analysis.riskFlags,
  },
});
    return NextResponse.json(
      {
        success: true,
        conversationId: conversation.id,
        analysis,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}