import { SpeechAnalysisResponse, SpeechAnalyzeResponse } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type AudioFile = {
  uri: string;
  name: string;
  type: string;
};

type Pronunciation = {
  word: string;
  listen_url: string;
  canonical: string;
  definition: string;
};

export const speechApiSlice = createApi({
  reducerPath: "speechApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL,
    validateStatus: () => {
      return true;
    },
  }),
  endpoints: (builder) => ({
    postTranscribe: builder.mutation<SpeechAnalysisResponse, AudioFile>({
      query: (audio: AudioFile) => {
        const formData = new FormData();
        formData.append("audio", {
          uri: audio.uri,
          type: audio.type,
          name: audio.name,
        } as any);
        return {
          url: "/transcribe",
          method: "POST",
          body: formData,
        };
      },
    }),
    postAnalyze: builder.mutation<SpeechAnalyzeResponse, string>({
      query: (audioPath: string) => ({
        url: "/analyze",
        method: "POST",
        body: {
          audio_path: audioPath,
        },
      }),
    }),
    getPronunciation: builder.query<Pronunciation, string>({
      query: (word: string) => ({
        url: `/pronounce/${word}`,
      }),
    }),
  }),
});

export const {
  usePostTranscribeMutation,
  usePostAnalyzeMutation,
  useGetPronunciationQuery,
} = speechApiSlice;
