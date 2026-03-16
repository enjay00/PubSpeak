import AudioPlayer from "@/components/audio-player";
import Result from "@/components/record/result";
import * as schema from "@/db/schema";
import { useAppDispatch, useAppSelector } from "@/hooks/useTypedSelector";
import { setPreviewState } from "@/redux/fileSlice";
import {
  setAnalyze,
  setMispronounced,
  setTranscribe,
} from "@/redux/resultSlice";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

export default function ViewResult() {
  const dispatch = useAppDispatch();
  const selectPreviewFile = useAppSelector((state) => state.file.previewState);

  const { speechId } = useLocalSearchParams<{ speechId: string }>();
  const db = useSQLiteContext();
  const [audioUri, setAudioUri] = useState<string | null>(null);

  useEffect(() => {
    const drizzleDb = drizzle(db, { schema });

    const speechData = drizzleDb
      .select()
      .from(schema.speech)
      .where(eq(schema.speech.audioUri, speechId as string))
      .get();

    if (!speechData || Object.keys(speechData).length === 0) return;

    const suggestionData = drizzleDb
      .select()
      .from(schema.suggestions)
      .where(eq(schema.suggestions.speechId, speechData.id as number))
      .all();
    const feedbackData = drizzleDb
      .select()
      .from(schema.feedback)
      .where(eq(schema.feedback.speechId, speechData.id as number))
      .get();
    const mispronounced = drizzleDb
      .select()
      .from(schema.mispronounced)
      .where(eq(schema.mispronounced.speechId, speechData.id as number))
      .all();

    setAudioUri(speechData.audioUri);

    dispatch(
      setTranscribe({
        text: speechData.transcribe,
        segments: [],
        words: [],
        audio_path: speechData.audioUri,
      }),
    );
    dispatch(
      setAnalyze({
        transcript: speechData.transcribe,
        pronunciation_analysis: {
          available: false,
          deviations: [],
          confidence_scores: {},
          summary: "",
          disclaimer: "",
        },
        annotated: speechData.summary,
        suggestions: suggestionData.map((suggestion) => suggestion.suggestion),
        explanations: [],
        feedback: {
          pronunciation: feedbackData?.pronunciation || [],
          grammar: feedbackData?.grammar || [],
          pace: feedbackData?.pace || [],
          pronunciation_metadata: {
            analysis_available: false,
            disclaimer: "",
            confidence_scores: {},
          },
        },
        grammar_corrected: {
          corrected_transcript: null,
          corrected_annotated:
            suggestionData.find(
              (suggestion) => (suggestion.grammarCorrected?.length ?? 0) > 1,
            )?.grammarCorrected || "",
          corrections: [],
        },
        improved: (() => {
          const found = suggestionData.find(
            (suggestion) => (suggestion.grammarCorrected?.length ?? 0) > 1,
          );
          return found?.improved ? JSON.parse(String(found.improved)) : [];
        })(),
      }),
    );
    console.log();
    dispatch(setMispronounced(mispronounced));
    dispatch(setPreviewState("previewFromFiles"));
  }, [dispatch, speechId, db]);

  return (
    <View className="bg-primary-dark flex-1">
      <Result />
      {selectPreviewFile === "previewFromFiles" && audioUri && (
        <AudioPlayer audioUri={audioUri} />
      )}
    </View>
  );
}
