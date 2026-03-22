import { describe, expect, it } from "vitest";
import { runCorrectionEngine } from "./correction-engine";

describe("runCorrectionEngine", () => {
  it("applies known correction rules and returns professional rewrite", () => {
    const result = runCorrectionEngine("I do a branch for solve and fix bug now");
    expect(result.corrected).toContain("create a branch");
    expect(result.corrected).toContain("to solve");
    expect(result.corrected).toContain("fix a bug");
    expect(result.matchedRules).toContain("do-a-branch");
    expect(result.professionalRewrite).toMatch(/\.$/);
  });

  it("keeps a good sentence and still returns normalized output", () => {
    const result = runCorrectionEngine("Please review this pull request before release.");
    expect(result.matchedRules).toHaveLength(0);
    expect(result.explanation).toContain("Looks good");
    expect(result.professionalRewrite).toBe("Please review this pull request before release.");
  });

  it("handles empty input safely", () => {
    const result = runCorrectionEngine("   ");
    expect(result.corrected).toBe("Please provide a sentence to analyze.");
    expect(result.explanation).toContain("Input cannot be empty.");
  });
});
