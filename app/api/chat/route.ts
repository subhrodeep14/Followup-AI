import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { retrieveRelevantChunks } from "@/services/retrieval.service";
import {
  createConversation,
  getConversation,
  saveMessage,
} from "@/services/chat.service";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const userId = getUserFromRequest(request);

    const {
      question,
      conversationId,
    }: {
      question: string;
      conversationId?: string;
    } = await request.json();

    if (!question?.trim()) {
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

    let conversation;

    if (conversationId) {
      conversation = await getConversation(
        conversationId,
        userId
      );
    }

    if (!conversation) {
      conversation = await createConversation(
        userId,
        question.slice(0, 50)
      );
    }

    await saveMessage(
      conversation.id,
      "user",
      question
    );

    const chunks = await retrieveRelevantChunks(
      question,
      5
    );
    console.log("========== RETRIEVED CHUNKS ==========");
console.log(JSON.stringify(chunks, null, 2));
console.log("======================================");

    const context = chunks
      .map(
        (chunk, index) =>
          `[Source ${index + 1}]\n${chunk.content}`
      )
      .join("\n\n");
      console.log("========== CONTEXT ==========");
console.log(context);
console.log("=============================");

    const prompt = `
You are FollowUp AI.

Answer ONLY from the context below.

If the answer does not exist in the context, reply:

"I couldn't find that information in the uploaded documents."

Context:

${context}

Question:

${question}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const answer =
      response.text ??
      "I couldn't generate an answer.";

    await saveMessage(
      conversation.id,
      "assistant",
      answer
    );

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      answer,
      citations: chunks.map((chunk) => ({
        chunkId: chunk.id,
        score: chunk.score,
        preview: chunk.content.substring(0, 180),
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