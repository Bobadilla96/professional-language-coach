import type { Lesson } from "@/domain/models/lesson";

export const technicalWritingLesson: Lesson = {
  id: "lesson-technical-writing-01",
  title: "Technical Writing for Busy Teams",
  topic: "technical-writing",
  level: "intermediate",
  description: "Learn how to write clearer PR descriptions, delivery updates and documentation notes for fast-moving teams.",
  estimatedMinutes: 14,
  completed: false,
  sourceTitle: "Google Developer Style Guide + GitHub Docs",
  sourceUrl: "https://developers.google.com/style",
  vocabulary: [
    {
      id: "v1",
      term: "Concise",
      pronunciation: "/ken-sais/",
      meaning: "Short and clear without unnecessary detail.",
      contextExample: "Keep the PR summary concise so reviewers can scan it quickly."
    },
    {
      id: "v2",
      term: "Audience",
      pronunciation: "/o-di-ens/",
      meaning: "The people who will read the message or document.",
      contextExample: "Write the release note for an audience that includes support and product."
    },
    {
      id: "v3",
      term: "Action item",
      pronunciation: "/ak-shon ai-tem/",
      meaning: "A task that someone needs to do after the discussion.",
      contextExample: "Close your update with a clear action item and owner."
    },
    {
      id: "v4",
      term: "Context",
      pronunciation: "/kon-tekst/",
      meaning: "Background information needed to understand a decision or issue.",
      contextExample: "Add context before the mitigation steps so the team understands the risk."
    },
    {
      id: "v5",
      term: "Consistency",
      pronunciation: "/ken-sis-ten-si/",
      meaning: "Using the same structure, wording, and conventions across documents.",
      contextExample: "Consistency makes the knowledge base easier to trust and maintain."
    }
  ],
  phrases: [
    {
      id: "p1",
      sentence: "I rewrote the PR description to make the scope and rollback plan easier to scan.",
      scenario: "pull-request",
      explanation: "Useful when you improved a PR for reviewers and release owners."
    },
    {
      id: "p2",
      sentence: "Let me add more context so the support team can follow the impact.",
      scenario: "slack",
      explanation: "Professional way to signal that your message needs clearer framing."
    },
    {
      id: "p3",
      sentence: "The update is concise, but it still includes owners, risk and next steps.",
      scenario: "planning",
      explanation: "Good phrase to describe a high-quality written update."
    }
  ],
  audioChallenge: {
    id: "a1",
    instruction: "Read aloud: The update is concise, but it still includes owners, risk and next steps.",
    targetPhraseId: "p3",
    connectedSpeechTip: "Link 'still includes' smoothly so it sounds like one idea instead of isolated words."
  }
};
