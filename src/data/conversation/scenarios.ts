import type { ConversationScenario } from "@/domain/models/conversation";

export const conversationScenarios: ConversationScenario[] = [
  {
    id: "daily-standup",
    title: "Daily Standup",
    context: "You are reporting progress, blockers and next step in a 2-minute standup.",
    objective: "Speak clearly with concise status updates.",
    starterPrompts: [
      "Yesterday I fixed the retry bug in the payment worker.",
      "Today I will finish the API integration tests.",
      "I am blocked because the staging credentials expired."
    ],
    coachFocus: [
      "Use time markers like yesterday, today and next.",
      "Name one blocker and one explicit action.",
      "Keep the update under three short sentences."
    ]
  },
  {
    id: "code-review",
    title: "Code Review Discussion",
    context: "You need to explain your pull request changes and answer reviewer concerns.",
    objective: "Use collaborative and professional wording.",
    starterPrompts: [
      "I split the component to reduce side effects and improve readability.",
      "I kept the old API shape to avoid breaking the mobile client.",
      "I can add a test for the empty-state branch in a follow-up commit."
    ],
    coachFocus: [
      "Explain the reason behind the change, not only the diff.",
      "Use collaborative phrases like I can adjust or we can keep.",
      "Acknowledge risk and mention validation or tests."
    ]
  },
  {
    id: "incident-update",
    title: "Production Incident Update",
    context: "A service degraded and you need to communicate impact and mitigation in Slack.",
    objective: "Use precise incident vocabulary with calm tone.",
    starterPrompts: [
      "We identified elevated latency in the checkout service.",
      "The impact is limited to European tenants at the moment.",
      "We rolled back the last deployment and error rate is decreasing."
    ],
    coachFocus: [
      "State impact, mitigation and next update clearly.",
      "Avoid emotional wording and keep the tone calm.",
      "Use concrete nouns like latency, rollback, tenants or error rate."
    ]
  },
  {
    id: "api-alignment",
    title: "Frontend/Backend API Alignment",
    context: "You need to align payload contract and status codes before release.",
    objective: "Negotiate technical changes without ambiguity.",
    starterPrompts: [
      "Can we confirm whether this endpoint returns 200 or 204 on success?",
      "The frontend needs a stable error shape for validation messages.",
      "If we rename this field, we should keep backward compatibility for one release."
    ],
    coachFocus: [
      "Ask one technical question at a time.",
      "Be explicit about contract, payload and compatibility.",
      "Close with a decision or a required confirmation."
    ]
  }
];
