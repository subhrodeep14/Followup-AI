export interface TextChunk {
  content: string;
  chunkIndex: number;
  wordCount: number;
}

interface ChunkOptions {
  chunkSize?: number;
  overlap?: number;
}

/**
 * Splits text into overlapping chunks.
 *
 * Default:
 * - 500 words per chunk
 * - 100 words overlap
 */
export function chunkText(
  text: string,
  options: ChunkOptions = {}
): TextChunk[] {
  const chunkSize = options.chunkSize ?? 500;
  const overlap = options.overlap ?? 100;

  if (chunkSize <= overlap) {
    throw new Error("chunkSize must be greater than overlap");
  }

  // Clean whitespace
  const cleanedText = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleanedText) {
    return [];
  }

  const words = cleanedText.split(" ");

  const chunks: TextChunk[] = [];

  let start = 0;
  let index = 0;

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);

    chunks.push({
      content: words.slice(start, end).join(" "),
      chunkIndex: index,
      wordCount: end - start,
    });

    if (end === words.length) {
      break;
    }

    start += chunkSize - overlap;
    index++;
  }

  return chunks;
}