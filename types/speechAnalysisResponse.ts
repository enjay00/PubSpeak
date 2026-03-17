import { Segment } from "./segment";
import { WordTimestamp } from "./wordTimestamp";

export type SpeechAnalysisResponse = {
  text: string;
  segments: Segment[];
  words: WordTimestamp[];
  audio_path: string;
};
