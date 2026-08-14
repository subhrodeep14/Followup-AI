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
const PRIMARY_MODEL = "gemini-3.6-flash";
const FALLBACK_MODEL = "gemini-3.5-flash-lite";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(error: unknown) {
  if (!error) return false;

  const message =
    error instanceof Error
      ? error.message
      : String(error);

  return (
    message.includes("503") ||
    message.includes("UNAVAILABLE") ||
    message.includes("high demand") ||
    message.includes("overloaded") ||
    message.includes("429") ||
    message.includes("RESOURCE_EXHAUSTED")
  );
}

async function generateWithRetry(
  prompt: string,
  model: string
) {
  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      console.log(
        `Gemini generation attempt ${
          attempt + 1
        } using ${model}`
      );

      const response =
        await ai.models.generateContent({
          model,
          contents: prompt,
        });

      return response;
    } catch (error) {
      lastError = error;

      console.error(
        `Gemini attempt ${attempt + 1} failed:`,
        error
      );

      if (!isRetryableError(error)) {
        throw error;
      }

      if (attempt < 2) {
        const delay = 1000 * Math.pow(2, attempt);

        console.log(
          `Retrying Gemini in ${delay}ms...`
        );

        await sleep(delay);
      }
    }
  }

  throw lastError;
}

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

    /*
     * Retrieve relevant document chunks.
     */
    const chunks = await retrieveRelevantChunks(
      question,
      userId,
      5
    );

    console.log(
      "========== RETRIEVED CHUNKS =========="
    );

    console.log(
      JSON.stringify(chunks, null, 2)
    );

    console.log(
      "======================================"
    );

    if (!chunks.length) {
      const answer =
        "I couldn't find relevant information in the uploaded documents.";

      await saveMessage(
        conversation.id,
        "assistant",
        answer
      );

      return NextResponse.json({
        success: true,
        conversationId: conversation.id,
        answer,
        citations: [],
      });
    }

    /*
     * Build RAG context.
     */
    const context = chunks
      .map(
        (chunk, index) =>
          `[Source ${index + 1}]\n${chunk.content}`
      )
      .join("\n\n");

    console.log(
      "========== CONTEXT =========="
    );

    console.log(context);

    console.log(
      "============================="
    );

    const prompt = `
You are FollowUp AI, an AI assistant that answers questions using uploaded business documents.

IMPORTANT RULES:

1. Answer using ONLY the provided document context.
2. Do not invent facts.
3. If the answer cannot be found in the context, say:
"I couldn't find that information in the uploaded documents."
4. Be concise but useful.
5. When multiple sources contain relevant information, combine them carefully.
6. Do not mention the internal retrieval process.
7. Do not mention embeddings, chunks, vectors, or RAG.
8. Preserve exact names, dates, amounts and percentages from the documents.

DOCUMENT CONTEXT:

${context}

USER QUESTION:

${question}

ANSWER:
`;

    let response;

    /*
     * Primary model.
     */
    try {
      response = await generateWithRetry(
        prompt,
        PRIMARY_MODEL
      );
    } catch (primaryError) {
      console.error(
        "Primary Gemini model failed:",
        primaryError
      );

      /*
       * Fallback model.
       */
      try {
        console.log(
          `Trying fallback model: ${FALLBACK_MODEL}`
        );

        response = await generateWithRetry(
          prompt,
          FALLBACK_MODEL
        );
      } catch (fallbackError) {
        console.error(
          "Fallback Gemini model failed:",
          fallbackError
        );

        throw new Error(
          "AI service is temporarily unavailable. Please try again in a moment."
        );
      }
    }

    const answer =
      response.text?.trim() ||
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
        preview: chunk.content.substring(
          0,
          180
        ),
        fileName: chunk.fileName,
        documentTitle:
          chunk.documentTitle,
      })),
    });
  } catch (error) {
    console.error(
      "Chat Error:",
      error
    );

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