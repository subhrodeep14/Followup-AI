import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const MODEL = "gemini-3.6-flash";

type GeneratedAnalysis = {
  summary: string;
  actionItems: {
    task: string;
    priority: "High" | "Medium" | "Low";
  }[];
  openQuestions: string[];
  draftEmail: string;
  riskFlags: string[];
};

export async function GET(request: NextRequest) {
  try {
    const userId = getUserFromRequest(request);

    const conversations = await prisma.conversation.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        analysis: {
          select: {
            summary: true,
            actionItems: true,
            openQuestions: true,
            draftEmail: true,
            riskFlags: true,
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error("GET /api/conversations error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load conversations.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserFromRequest(request);

    const body = await request.json();

    const title =
      typeof body.title === "string" && body.title.trim()
        ? body.title.trim()
        : "New Analysis";

    const clientName =
      typeof body.clientName === "string" && body.clientName.trim()
        ? body.clientName.trim()
        : null;

    const rawInput =
      typeof body.rawInput === "string"
        ? body.rawInput.trim()
        : "";

    if (!rawInput) {
      return NextResponse.json(
        {
          success: false,
          message: "Conversation text is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * 1. Create the conversation
     */
    const conversation = await prisma.conversation.create({
      data: {
        title,
        clientName,
        rawInput,
        userId,
      },
    });

    /*
     * 2. Ask Gemini to generate the complete analysis
     */
    const prompt = `
You are FollowUp AI, an AI business conversation analyst.

Analyze the following client conversation and return ONLY valid JSON.

The JSON MUST have exactly these fields:

{
  "summary": "A concise executive summary",
  "actionItems": [
    {
      "task": "Specific actionable task",
      "priority": "High"
    }
  ],
  "openQuestions": [
    "Question that still needs clarification"
  ],
  "draftEmail": "Professional follow-up email",
  "riskFlags": [
    "Important risk, blocker, dependency, delay, ambiguity, or concern"
  ]
}

Rules:

1. Do not invent information.
2. Extract action items from the conversation.
3. Assign every action item one priority:
   High, Medium, or Low.
4. Identify unanswered questions.
5. Write a professional follow-up email that can be sent to the client.
6. Identify risks, blockers, dependencies, missing information, delays, or approval issues.
7. If there are no open questions, return [].
8. If there are no risks, return [].
9. Keep the summary concise but useful.
10. Return JSON only. No markdown.
11. Preserve names, dates, amounts, deadlines and other facts exactly.

CLIENT CONVERSATION:

${rawInput}
`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const text = response.text?.trim();

    if (!text) {
      throw new Error("AI returned an empty analysis.");
    }

    /*
     * 3. Parse Gemini JSON
     */
    let analysis: GeneratedAnalysis;

    try {
      const cleanedText = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      analysis = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse Gemini analysis:", parseError);
      console.error("Gemini response:", text);

      throw new Error(
        "AI returned an invalid analysis format."
      );
    }

    /*
     * 4. Validate the generated structure
     */
    if (
      typeof analysis.summary !== "string" ||
      !Array.isArray(analysis.actionItems) ||
      !Array.isArray(analysis.openQuestions) ||
      typeof analysis.draftEmail !== "string" ||
      !Array.isArray(analysis.riskFlags)
    ) {
      throw new Error(
        "AI returned an incomplete analysis."
      );
    }

    /*
     * 5. Save the analysis in Prisma
     */
    const savedAnalysis = await prisma.analysis.create({
      data: {
        conversationId: conversation.id,
        summary: analysis.summary,
        actionItems: analysis.actionItems,
        openQuestions: analysis.openQuestions,
        draftEmail: analysis.draftEmail,
        riskFlags: analysis.riskFlags,
      },
    });

    /*
     * 6. Return everything to the frontend
     */
    return NextResponse.json(
      {
        success: true,
        message: "Analysis generated successfully.",
        conversationId: conversation.id,
        data: {
          conversation,
          analysis: savedAnalysis,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/conversations error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to generate analysis.",
      },
      {
        status: 500,
      }
    );
  }
}