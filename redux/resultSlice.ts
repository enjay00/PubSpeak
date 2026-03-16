import { SpeechAnalysisResponse, SpeechAnalyzeResponse } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ResultInitialState = {
  transcribe: SpeechAnalysisResponse;
  analyze: SpeechAnalyzeResponse;
  resultId: string;
  mispronounced: Mispronounce[];
};

export type Mispronounce = {
  id: number;
  word: string;
  url: string;
  localUri: string;
  phonemes: string;
  definition: string;
  speechId: number;
  createdAt: Date;
  updatedAt: Date;
};

let initialState: ResultInitialState = {
  transcribe: {
    text: "",
    segments: [],
    words: [],
    audio_path: "",
  },
  analyze: {
    transcript: "",
    pronunciation_analysis: {
      available: false,
      deviations: [],
      confidence_scores: {},
      summary: "",
      disclaimer: "",
    },
    annotated: "",
    suggestions: [],
    explanations: [],
    feedback: {
      pronunciation: [],
      grammar: [],
      pace: [],
      pronunciation_metadata: {
        analysis_available: false,
        disclaimer: "",
        confidence_scores: {},
      },
    },
    grammar_corrected: {
      corrected_transcript: null,
      corrected_annotated: null,
      corrections: [],
    },
    improved: [],
  },
  resultId: "",
  mispronounced: [],
};

export const resultSlice = createSlice({
  name: "result",
  initialState,
  reducers: {
    setTranscribe: (state, action: PayloadAction<SpeechAnalysisResponse>) => {
      state.transcribe = action.payload;
    },
    setAnalyze: (state, action: PayloadAction<SpeechAnalyzeResponse>) => {
      state.analyze = action.payload;
    },
    cleanUpTranscribe: (state) => {
      state.transcribe = {
        text: "",
        segments: [],
        words: [],
        audio_path: "",
      };
    },
    cleanUpAnalyze: (state) => {
      state.analyze = {
        transcript: "",
        pronunciation_analysis: {
          available: false,
          deviations: [],
          confidence_scores: {},
          summary: "",
          disclaimer: "",
        },
        annotated: "",
        suggestions: [],
        explanations: [],
        feedback: {
          pronunciation: [],
          grammar: [],
          pace: [],
          pronunciation_metadata: {
            analysis_available: false,
            disclaimer: "",
            confidence_scores: {},
          },
        },
        grammar_corrected: {
          corrected_transcript: null,
          corrected_annotated: null,
          corrections: [],
        },
        improved: [],
      };
    },
    setResultId: (state, action: PayloadAction<string>) => {
      state.resultId = action.payload;
    },
    cleanUpResultId: (state) => {
      state.resultId = "";
    },
    setMispronounced: (state, action: PayloadAction<Mispronounce[]>) => {
      state.mispronounced = action.payload;
    },
    cleanUpMispronounced: (state) => {
      state.mispronounced = [];
    },
  },
  extraReducers(builder) {},
});

export const {
  setTranscribe,
  cleanUpTranscribe,
  setAnalyze,
  cleanUpAnalyze,
  setResultId,
  cleanUpResultId,
  setMispronounced,
  cleanUpMispronounced,
} = resultSlice.actions;
export default resultSlice.reducer;
