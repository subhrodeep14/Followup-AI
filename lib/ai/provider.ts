import { z } from "zod";

export const AnalysisSchema = z.object({
  summary: z.string(),

  actionItems: z.array(
    z.object({
      task: z.string(),
      priority: z.enum(["High", "Medium", "Low"]),
    })
  ),

  openQuestions: z.array(z.string()),

  draftEmail: z.string(),

  riskFlags: z.array(z.string()),
});

export type AnalysisResult = z.infer<typeof AnalysisSchema>;

export function validateAnalysis(data: unknown): AnalysisResult {
  return AnalysisSchema.parse(data);
}