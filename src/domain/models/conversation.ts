export interface ConversationScenario {
  id: string;
  title: string;
  context: string;
  objective: string;
  starterPrompts: string[];
  coachFocus: string[];
}

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
