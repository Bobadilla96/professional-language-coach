import { describe, expect, it } from "vitest";
import { lessons } from "@/data/lessons";
import { userProgressMock } from "@/data/mocks/user-progress.mock";
import { calculateTotalProgress, getNextLesson } from "./progress-engine";

describe("progress-engine", () => {
  it("calculates total progress based on completed lessons", () => {
    const total = calculateTotalProgress(
      { ...userProgressMock, completedLessons: [lessons[0].id, lessons[1].id] },
      lessons.length
    );
    expect(total).toBe(Math.round((2 / lessons.length) * 100));
  });

  it("returns zero when there are no lessons", () => {
    const total = calculateTotalProgress(userProgressMock, 0);
    expect(total).toBe(0);
  });

  it("returns first non-completed lesson", () => {
    const next = getNextLesson(lessons, [lessons[0].id]);
    expect(next?.id).toBe(lessons[1].id);
  });
});
