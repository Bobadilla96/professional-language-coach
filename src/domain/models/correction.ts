export interface CorrectionResult {
  original: string;
  corrected: string;
  explanation: string;
  professionalRewrite: string;
  matchedRules: string[];
}
