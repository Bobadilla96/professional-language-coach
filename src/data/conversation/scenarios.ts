export interface ConversationScenario {
  id: string;
  title: string;
  context: string;
  objective: string;
}

export const conversationScenarios: ConversationScenario[] = [
  {
    id: "daily-standup",
    title: "Daily Standup",
    context: "You are reporting progress, blockers and next step in a 2-minute standup.",
    objective: "Speak clearly with concise status updates."
  },
  {
    id: "code-review",
    title: "Code Review Discussion",
    context: "You need to explain your pull request changes and answer reviewer concerns.",
    objective: "Use collaborative and professional wording."
  },
  {
    id: "incident-update",
    title: "Production Incident Update",
    context: "A service degraded and you need to communicate impact and mitigation in Slack.",
    objective: "Use precise incident vocabulary with calm tone."
  },
  {
    id: "api-alignment",
    title: "Frontend/Backend API Alignment",
    context: "You need to align payload contract and status codes before release.",
    objective: "Negotiate technical changes without ambiguity."
  }
];
