import type { Lesson } from "@/domain/models/lesson";

export const apiCollaborationLesson: Lesson = {
  id: "lesson-api-collaboration-01",
  title: "API Collaboration English",
  topic: "apis",
  level: "upper-intermediate",
  description: "Discuss API contracts, payloads and integration blockers.",
  estimatedMinutes: 16,
  completed: false,
  sourceTitle: "HTTP + OpenAPI",
  sourceUrl: "https://swagger.io/specification/",
  vocabulary: [
    {
      id: "api-v1",
      term: "Endpoint",
      pronunciation: "/end-point/",
      meaning: "A specific URL and method that exposes an API operation.",
      contextExample: "This endpoint returns the paginated list of invoices."
    },
    {
      id: "api-v2",
      term: "Payload",
      pronunciation: "/pei-loud/",
      meaning: "The JSON body sent in a request or returned in a response.",
      contextExample: "The payload is missing the required customerId field."
    },
    {
      id: "api-v3",
      term: "Schema",
      pronunciation: "/ski-ma/",
      meaning: "The structured definition of fields, types and constraints.",
      contextExample: "Please update the schema to include nullable metadata."
    },
    {
      id: "api-v4",
      term: "Backward compatible",
      pronunciation: "/bak-werd kem-pa-ti-bol/",
      meaning: "A change that does not break existing clients using older behavior.",
      contextExample: "Adding an optional field is usually backward compatible."
    },
    {
      id: "api-v5",
      term: "Rate limit",
      pronunciation: "/reit li-mit/",
      meaning: "A cap on request frequency to protect API stability.",
      contextExample: "The mobile app hit the rate limit during bulk sync."
    }
  ],
  phrases: [
    {
      id: "api-p1",
      sentence: "This endpoint should return 422 when the payload fails validation.",
      scenario: "planning",
      explanation: "Direct and precise contract language for API behavior."
    },
    {
      id: "api-p2",
      sentence: "We need this change to stay backward compatible for current clients.",
      scenario: "code-review",
      explanation: "Common phrase when reviewing contract evolution."
    },
    {
      id: "api-p3",
      sentence: "Can we align the OpenAPI schema before frontend integration starts?",
      scenario: "slack",
      explanation: "Polite coordination request across frontend and backend teams."
    }
  ],
  audioChallenge: {
    id: "a-api-1",
    instruction: "Read aloud: This endpoint should return 422 when the payload fails validation.",
    targetPhraseId: "api-p1",
    connectedSpeechTip: "Keep endpoint, 422 and payload clearly articulated."
  }
};
