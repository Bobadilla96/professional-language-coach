import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => <a href={href}>{children}</a>
}));

import LessonDetailPageFeature from "./lesson-detail-page";

describe("LessonDetailPageFeature", () => {
  it("renders lesson details for an existing lesson", () => {
    render(<LessonDetailPageFeature lessonId="lesson-git-workflow-01" />);

    expect(screen.getByRole("heading", { name: "Git and Workflow Essentials" })).toBeInTheDocument();
    expect(screen.getByText("Branch")).toBeInTheDocument();
    expect(screen.getByText("Start practice")).toBeInTheDocument();
  });

  it("renders empty state when lesson does not exist", () => {
    render(<LessonDetailPageFeature lessonId="missing-lesson" />);
    expect(screen.getByText("Lesson not found")).toBeInTheDocument();
  });
});
