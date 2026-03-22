import type { Course } from "@/domain/models/course";
import { lessonsById } from "@/data/lessons";

export const courses: Course[] = [
  {
    id: "course-developer-english-core",
    slug: "developer-english-core",
    title: "Developer English Core",
    subtitle: "Communication for standups, reviews, debugging and delivery",
    description:
      "Structured route for software teams that need practical English for daily execution, technical alignment and incident updates.",
    level: "intermediate",
    professionalTrack: "developer",
    goals: ["collaborate-at-work", "understand-technical-docs", "speak-confidently"],
    estimatedHours: 12,
    status: "published",
    coverLabel: "Core Route",
    outcomes: [
      "Explain progress clearly in standups and async updates.",
      "Write better pull request comments and review responses.",
      "Handle debugging and API alignment with more confidence."
    ],
    modules: [
      {
        id: "module-dev-flow",
        title: "Flow and Collaboration",
        description: "Core language for branches, pull requests and review loops.",
        lessonIds: ["lesson-git-workflow-01", "lesson-code-review-01"],
        outcome: "Participate in code delivery conversations with less friction."
      },
      {
        id: "module-dev-reliability",
        title: "Debugging and Delivery",
        description: "Communication patterns for issues, APIs and production risk.",
        lessonIds: ["lesson-debugging-01", "lesson-api-collaboration-01"],
        outcome: "Report bugs, align API work and describe risks precisely."
      }
    ]
  },
  {
    id: "course-writing-for-work",
    slug: "writing-for-work",
    title: "Writing for Work",
    subtitle: "Technical writing, context and incident communication",
    description:
      "Route focused on written communication: concise documentation, status updates, postmortem summaries and action-oriented writing.",
    level: "intermediate",
    professionalTrack: "writing",
    goals: ["write-professionally", "collaborate-at-work"],
    estimatedHours: 8,
    status: "published",
    coverLabel: "Writing Route",
    outcomes: [
      "Write clearer technical updates for busy teams.",
      "Document incidents with context, impact and next steps.",
      "Reduce ambiguity in async communication."
    ],
    modules: [
      {
        id: "module-writing-clarity",
        title: "Clear Technical Writing",
        description: "Write concise updates with better context and action items.",
        lessonIds: ["lesson-technical-writing-01"],
        outcome: "Produce clearer notes, summaries and task descriptions."
      },
      {
        id: "module-writing-incidents",
        title: "Incident Communication",
        description: "Communicate impact, mitigation and follow-up in production events.",
        lessonIds: ["lesson-incident-response-01"],
        outcome: "Report incidents with professional and structured language."
      }
    ]
  },
  {
    id: "course-conversation-lab",
    slug: "conversation-lab",
    title: "Conversation Lab",
    subtitle: "Guided speaking practice for real workplace scenarios",
    description:
      "Scenario-based speaking route connected to the conversation coach and VibeVoice. Built for live drills and structured repetition.",
    level: "intermediate",
    professionalTrack: "conversation",
    goals: ["speak-confidently", "prepare-interviews"],
    estimatedHours: 10,
    status: "coming-soon",
    coverLabel: "Speaking Route",
    outcomes: [
      "Practice spoken English for standups and blockers.",
      "Rehearse incident updates and stakeholder explanations.",
      "Prepare for interviews and technical conversations."
    ],
    modules: [
      {
        id: "module-conversation-scenarios",
        title: "Scenario Drills",
        description: "Interactive speaking labs powered by the conversation module.",
        lessonIds: [],
        outcome: "Build fluency through guided role-play."
      }
    ]
  }
];

export const coursesById = Object.fromEntries(courses.map((course) => [course.id, course])) as Record<string, Course>;

export const publishedCourses = courses.filter((course) => course.status === "published");

export function getCourseFirstLessonId(courseId: string) {
  const course = coursesById[courseId];
  return course?.modules.flatMap((module) => module.lessonIds)[0] ?? "";
}

export function getCourseFirstLesson(courseId: string) {
  const lessonId = getCourseFirstLessonId(courseId);
  return lessonId ? lessonsById[lessonId] ?? null : null;
}
