export type PracticeQuestionType = "multiple-choice" | "fill-in-the-blank" | "sentence-correction" | "scenario-selection";

export interface PracticeSupport {
  promptEs?: string;
  contextEs?: string;
  taskEs: string;
  hintEs: string;
  explanationEs: string;
  answerMeaningEs?: string;
  optionGlossary?: Record<string, string>;
}

export interface BasePracticeQuestion {
  id: string;
  type: PracticeQuestionType;
  prompt: string;
  explanation: string;
  support?: PracticeSupport;
}

export interface MultipleChoiceQuestion extends BasePracticeQuestion {
  type: "multiple-choice";
  options: string[];
  correctAnswer: string;
}

export interface FillInTheBlankQuestion extends BasePracticeQuestion {
  type: "fill-in-the-blank";
  sentence: string;
  correctAnswer: string;
}

export interface SentenceCorrectionQuestion extends BasePracticeQuestion {
  type: "sentence-correction";
  incorrectSentence: string;
  correctedSentence: string;
}

export interface ScenarioSelectionQuestion extends BasePracticeQuestion {
  type: "scenario-selection";
  scenario: string;
  options: string[];
  correctAnswer: string;
}

export type PracticeQuestion =
  | MultipleChoiceQuestion
  | FillInTheBlankQuestion
  | SentenceCorrectionQuestion
  | ScenarioSelectionQuestion;
