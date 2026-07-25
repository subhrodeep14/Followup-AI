export interface AnalysisResult {
  summary: string;
  actionItems: {
    task: string;
    priority: "High" | "Medium" | "Low";
  }[];
  openQuestions: string[];
  draftEmail: string;
  riskFlags: string[];
}