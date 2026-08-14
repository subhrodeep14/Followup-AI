export interface ActionItem {
  task: string;
  priority: "High" | "Medium" | "Low";
}

export interface Analysis {
  summary: string;
  actionItems: ActionItem[];
  openQuestions: string[];
  draftEmail: string;
  riskFlags: string[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  clientName: string | null;
  rawInput: string | null;
  createdAt: string;

  analysis: Analysis | null;

  messages?: Message[];
}