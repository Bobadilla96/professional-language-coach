import { beforeEach, describe, expect, it } from "vitest";
import { lessons } from "@/data/lessons";
import { userProgressMock } from "@/data/mocks/user-progress.mock";
import { useProgressStore } from "./progress-store";

function cloneProgress() {
  return JSON.parse(JSON.stringify(userProgressMock));
}

describe("useProgressStore", () => {
  beforeEach(() => {
    window.localStorage.removeItem("tech-english-progress");
    useProgressStore.setState({ progress: cloneProgress() });
  });

  it("completes a lesson and recalculates total progress", () => {
    useProgressStore.getState().completeLesson("lesson-git-workflow-01");
    const progress = useProgressStore.getState().progress;

    expect(progress.completedLessons).toContain("lesson-git-workflow-01");
    expect(progress.totalProgress).toBe(Math.round((1 / lessons.length) * 100));
    expect(progress.recentActivity[0]).toContain("Completed lesson-git-workflow-01");
  });

  it("saves practice result and tracks attempts", () => {
    const state = useProgressStore.getState();
    state.savePracticeResult("lesson-code-review-01", 80, "code-review");
    state.savePracticeResult("lesson-code-review-01", 60, "code-review");

    const lessonProgress = useProgressStore.getState().progress.lessonProgress.find((x) => x.lessonId === "lesson-code-review-01");
    const topic = useProgressStore.getState().progress.topicProgress.find((x) => x.topic === "code-review");

    expect(lessonProgress?.attempts).toBe(2);
    expect(lessonProgress?.score).toBe(60);
    expect(topic?.accuracy).toBe(70);
    expect(topic?.weakPoints).toContain("grammar");
  });

  it("persists data in localStorage", () => {
    useProgressStore.getState().completeLesson("lesson-debugging-01");
    const raw = window.localStorage.getItem("tech-english-progress");
    expect(raw).toBeTruthy();

    const parsed = JSON.parse(raw as string) as { state: { progress: { completedLessons: string[] } } };
    expect(parsed.state.progress.completedLessons).toContain("lesson-debugging-01");
  });
});
