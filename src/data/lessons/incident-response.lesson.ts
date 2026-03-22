import type { Lesson } from "@/domain/models/lesson";

export const incidentResponseLesson: Lesson = {
  id: "lesson-incident-response-01",
  title: "Incident Updates and Postmortem Language",
  topic: "incident-response",
  level: "upper-intermediate",
  description: "Practice the language used to report impact, mitigation and next steps during operational incidents.",
  estimatedMinutes: 16,
  completed: false,
  sourceTitle: "Atlassian Incident Management Handbook",
  sourceUrl: "https://www.atlassian.com/incident-management/handbook/postmortems",
  vocabulary: [
    {
      id: "v1",
      term: "Impact",
      pronunciation: "/im-pakt/",
      meaning: "The effect of an issue on users, systems or business operations.",
      contextExample: "The impact is limited to new sign-ups in the EU region."
    },
    {
      id: "v2",
      term: "Mitigation",
      pronunciation: "/mi-ti-gei-shon/",
      meaning: "An action taken to reduce the severity of the incident before a full fix is available.",
      contextExample: "We deployed a mitigation while the root cause investigation continued."
    },
    {
      id: "v3",
      term: "Root cause",
      pronunciation: "/rut koz/",
      meaning: "The underlying reason that caused the incident to happen.",
      contextExample: "The root cause was a misconfigured cache policy in production."
    },
    {
      id: "v4",
      term: "Recovery",
      pronunciation: "/ri-ka-ve-ri/",
      meaning: "The process of restoring the service to a stable state.",
      contextExample: "Recovery started at 14:20 UTC after the rollback completed."
    },
    {
      id: "v5",
      term: "Follow-up",
      pronunciation: "/fo-lo ap/",
      meaning: "A task or decision that must happen after the incident is resolved.",
      contextExample: "The follow-up includes adding alerts and documenting the failure mode."
    }
  ],
  phrases: [
    {
      id: "p1",
      sentence: "Customer checkout is degraded, but the mitigation is already in progress.",
      scenario: "slack",
      explanation: "Good live-status update during an incident."
    },
    {
      id: "p2",
      sentence: "The current impact is limited to write operations in one region.",
      scenario: "planning",
      explanation: "Professional way to scope blast radius."
    },
    {
      id: "p3",
      sentence: "We will publish a follow-up with timeline, root cause and preventive actions.",
      scenario: "daily-standup",
      explanation: "Useful when closing an incident loop with accountability."
    }
  ],
  audioChallenge: {
    id: "a1",
    instruction: "Read aloud: The current impact is limited to write operations in one region.",
    targetPhraseId: "p2",
    connectedSpeechTip: "Try to keep 'limited to write operations' flowing as one chunk to sound more natural."
  }
};
