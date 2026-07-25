import { GoogleGenAI } from "@google/genai";

import { ANALYZE_CONVERSATION_PROMPT } from "./prompts/analyze";
import { validateAnalysis, AnalysisResult } from "./provider";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined.");
}

const ai = new GoogleGenAI({
  apiKey,
});

const MODEL = "gemini-3.6-flash";

export async function generateAnalysis(
  conversation: string
): Promise<AnalysisResult> {
  const prompt = `
${ANALYZE_CONVERSATION_PROMPT}

Conversation:

${conversation}
`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    const parsed = JSON.parse(response.text);

    return validateAnalysis(parsed);
  }  catch (error) {
  console.error("Gemini Error:", error);

  if (error instanceof Error) {
    console.error(error.message);
    throw error;
  }

  throw new Error("Failed to generate AI analysis.");
}
}