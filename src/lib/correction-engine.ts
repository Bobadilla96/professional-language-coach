import type { CorrectionResult } from "@/domain/models/correction";

const RULES: Array<{ name: string; test: RegExp; replace: string; hint: string }> = [
  { name: "do-a-branch", test: /\bdo a branch\b/i, replace: "create a branch", hint: "Use create a branch in engineering context." },
  { name: "revert-deploy", test: /\brevert the deploy\b/i, replace: "rollback the deployment", hint: "Rollback the deployment is the standard phrasing." },
  { name: "fix-bug-article", test: /\bfix bug\b/i, replace: "fix a bug", hint: "Use an article: a bug." },
  { name: "for-solve", test: /\bfor solve\b/i, replace: "to solve", hint: "Use infinitive: to solve." },
  { name: "review-code-for-merge", test: /\breview this code for merge\b/i, replace: "please review this code before merge", hint: "Add politeness and clearer timing." }
];

export function runCorrectionEngine(input: string): CorrectionResult {
  let corrected = input.trim();
  const matchedRules: string[] = [];
  const explanations: string[] = [];

  for (const rule of RULES) {
    if (rule.test.test(corrected)) {
      corrected = corrected.replace(rule.test, rule.replace);
      matchedRules.push(rule.name);
      explanations.push(rule.hint);
    }
  }

  if (!corrected) {
    corrected = "Please provide a sentence to analyze.";
    explanations.push("Input cannot be empty.");
  }

  const professionalRewrite = corrected
    .replace(/^i\b/i, "I")
    .replace(/\s+/g, " ")
    .replace(/\s\./g, ".")
    .trim();

  return {
    original: input,
    corrected,
    explanation: explanations.length ? explanations.join(" ") : "Looks good. Keep the message concise and specific.",
    professionalRewrite: professionalRewrite.endsWith(".") ? professionalRewrite : `${professionalRewrite}.`,
    matchedRules
  };
}
