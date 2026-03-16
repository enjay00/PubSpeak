export type SpeechAnalyzeResponse = {
  transcript: string;
  pronunciation_analysis: PronunciationAnalysis;
  annotated: string;
  suggestions: string[];
  explanations: string[];
  feedback: Feedback;
  grammar_corrected: {
    corrected_transcript: null | string;
    corrected_annotated: null | string;
    corrections: string[];
  };
  improved: {
    improved_transcript: string | null;
    improved_annotated: string | null;
  }[];
};

export type PronunciationAnalysis = {
  available: boolean;
  deviations: PronunciationDeviation[];
  confidence_scores: ConfidenceScores;
  summary: string;
  disclaimer: string;
};

export type PronunciationDeviation = {
  word: string;
  expected: string;
  expected_ipa: string;
  actual_ipa: string;
  expected_readable: string;
  actual: string;
  similarity: number;
  severity: "low" | "moderate" | "high";
  start: number;
  end: number;
};

export type ConfidenceScores = {
  [word: string]: number;
};

export type Feedback = {
  pronunciation: FeedbackMessage[];
  grammar: FeedbackMessage[];
  pace: FeedbackMessage[];
  pronunciation_metadata: PronunciationMetadata;
};

export type FeedbackMessage = {
  type: "info" | "positive" | "warning" | "negative";
  message: string;
};

export type PronunciationMetadata = {
  analysis_available: boolean;
  disclaimer: string;
  confidence_scores: ConfidenceScores;
};
