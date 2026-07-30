import { NextRequest, NextResponse } from "next/server";

import { GoogleGenAI } from "@google/genai";

import { retrieveRelevantChunks } from "@/services/retrieval.service";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const question = body.question?.trim();

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          message: "Question is required.",
        },
        {
          status: 400,
        }
      );
    }

    // Retrieve relevant chunks
    const chunks = await retrieveRelevantChunks(question, 5);

    const context = chunks
      .map(
        (chunk, index) =>
          `[Chunk ${index + 1}]\n${chunk.content}`
      )
      .join("\n\n");

    const prompt = `
You are an AI assistant for FollowUp AI.

Answer ONLY using the provided context.

If the answer is not present in the context, reply:

"I couldn't find that information in the uploaded documents."

Context:

${context}

Question:

${question}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const answer =
      response.text ??
      "I couldn't generate an answer.";

    return NextResponse.json({
      success: true,
      answer,
      citations: chunks.map((chunk) => ({
        chunkId: chunk.id,
        preview: chunk.content.substring(0, 150),
        score: chunk.score,
      })),
    });
  } catch (error) {
    console.error("Chat Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Chat failed.",
      },
      {
        status: 500,
      }
    );
  }
}