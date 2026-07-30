import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await ai.models.embedContent({
  model: "gemini-embedding-001",
  contents: text,
});

console.log("Gemini response:", response);

const embedding = response.embeddings?.[0]?.values;

console.log(
  "Embedding exists:",
  !!embedding
);

    

    if (!embedding) {
      throw new Error("Embedding generation failed.");
    }

    return embedding;
  } catch (error) {
    console.error("Gemini Embedding Error:", error);
    throw error;
  }
}