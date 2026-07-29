import PDFParser from "pdf2json";
import mammoth from "mammoth";

export async function extractText(
  buffer: Buffer,
  fileType: string
): Promise<string> {
  switch (fileType) {
    case "application/pdf":
      return extractPdfText(buffer);

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return extractDocxText(buffer);

    case "text/plain":
      return extractTxtText(buffer);

    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(undefined, true);

    pdfParser.on("pdfParser_dataError", (err: any) => {
      reject(err.parserError ?? err);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      try {
        let text = "";

        for (const page of pdfData.Pages ?? []) {
          for (const item of page.Texts ?? []) {
            const decoded = (item.R ?? [])
              .map((r: any) => {
                try {
                  return decodeURIComponent(r.T);
                } catch {
                  return r.T ?? "";
                }
              })
              .join("");

            text += decoded + " ";
          }

          text += "\n";
        }

        resolve(cleanText(text));
      } catch (error) {
        reject(error);
      }
    });

    pdfParser.parseBuffer(buffer);
  });
}
async function extractDocxText(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({
    buffer,
  });

  return cleanText(result.value);
}

async function extractTxtText(buffer: Buffer): Promise<string> {
  return cleanText(buffer.toString("utf-8"));
}

function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}