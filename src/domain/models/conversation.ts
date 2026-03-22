export interface ConversationTurn {
  id: string;
  role: "user" | "coach";
  text: string;
  improvedSentence?: string;
  quickTips?: string[];
}

export interface ConversationCoachResponse {
  coachReply: string;
  improvedSentence: string;
  quickTips: string[];
}
