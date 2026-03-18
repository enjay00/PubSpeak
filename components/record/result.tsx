import { useAppSelector } from "@/hooks/useTypedSelector";
import clsx from "clsx";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Feedback from "./tabs/feedback";
import Mispronunciations from "./tabs/mispronunciations";
import MispronunciationsLocal from "./tabs/mispronunciations-local";
import NewSuggestion from "./tabs/new_suggestion";
import Summary from "./tabs/summary";
import Transcript from "./tabs/transcript";

const tabs = [
  "Transcript",
  "Summary",
  "Mispronunciations",
  "Suggestions",
  "Feedback",
] as const;
export default function Result() {
  const [selectedTab, setSelectedTab] =
    useState<(typeof tabs)[number]>("Transcript");
  const selectPreviewState = useAppSelector((state) => state.file.previewState);
  const selectTranscribe = useAppSelector((state) => state.result.transcribe);
  const selectAnalyze = useAppSelector((state) => state.result.analyze);
  const selectMispronounced = useAppSelector(
    (state) => state.result.mispronounced,
  );
  const uniqueDeviations =
    selectAnalyze.pronunciation_analysis.deviations.filter(
      (e, index, array) =>
        array.findIndex((item) => item.word === e.word) === index,
    );

  return (
    <View className="bg-[#2D2D2D] flex-1">
      <ScrollView
        contentContainerClassName="gap-2 p-5"
        scrollEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-none"
      >
        {tabs.map((tab, index) => (
          <Text
            onPress={() => setSelectedTab(tab)}
            className={clsx(
              "font-montserrat-bold text-xs",
              selectedTab === tab ? "text-primary-amber" : "text-primary-light",
            )}
            key={index}
          >
            {tab}
          </Text>
        ))}
      </ScrollView>
      <View className="h-0.75 bg-[lightgray] rounded-full w-11/12  self-center mb-7" />
      {selectedTab === "Suggestions" && (
        <View className="flex flex-row items-center gap-2 justify-start px-5">
          <View>
            <View className="flex flex-row items-center gap-2 mb-5">
              <View className="h-3 w-3 bg-[#FF383E] rounded-full"></View>
              <Text className="font-montserrat text-xs text-primary-light">
                Mispronunciation
              </Text>
            </View>
            <View className="flex flex-row items-center gap-2 mb-5">
              <View className="h-3 w-3 bg-[#FFD700] rounded-full"></View>
              <Text className="font-montserrat text-xs text-primary-light">
                Wrong Grammar
              </Text>
            </View>
          </View>
          <View>
            <View className="flex flex-row items-center gap-2 mb-5">
              <View className="h-3 w-3 bg-[#A0FFA0] rounded-full"></View>
              <Text className="font-montserrat text-xs text-primary-light">
                Corrected Grammar
              </Text>
            </View>
            <View className="flex flex-row items-center gap-2 mb-5">
              <View className="h-3 w-3 bg-[#48A7FF] rounded-full"></View>
              <Text className="font-montserrat text-xs text-primary-light">
                Improved Grammar
              </Text>
            </View>
          </View>
        </View>
      )}
      {selectedTab === "Summary" && (
        <View className="px-5">
          <View className="flex flex-row items-center gap-2 mb-5">
            <View className="h-3 w-3 bg-[#FF383E] rounded-full"></View>
            <Text className="font-montserrat text-xs text-primary-light">
              Mispronunciation
            </Text>
          </View>
          <View className="flex flex-row items-center gap-2 mb-5">
            <View className="h-3 w-3 bg-[#FFD700] rounded-full"></View>
            <Text className="font-montserrat text-xs text-primary-light">
              Wrong Grammar
            </Text>
          </View>
        </View>
      )}
      <View className="bg-primary-dark flex-1 rounded-t-[15px] p-5">
        <ScrollView showsVerticalScrollIndicator={false}>
          {selectedTab === "Transcript" && (
            <Transcript value={selectTranscribe.text} />
          )}
          {selectedTab === "Summary" && (
            <Summary value={selectAnalyze.annotated} />
          )}
          {selectedTab === "Mispronunciations" && (
            <>
              <Text className="font-montserrat-bold text-2xl text-primary-light text-center mb-5">
                Mispronounced -{" "}
                {uniqueDeviations.length || selectMispronounced.length}
              </Text>
              {selectPreviewState === "previewFromFiles" &&
                selectMispronounced.map((e, index) => (
                  <MispronunciationsLocal key={index} mispronunciations={e} />
                ))}
              {selectPreviewState === "previewFromOnRecord" &&
                uniqueDeviations.map((e, index) => (
                  <Mispronunciations key={index} deviations={e} />
                ))}
            </>
          )}
          {selectedTab === "Suggestions" && (
            // selectAnalyze.suggestions.map((value, index) => (
            //   <Suggestions value={value} key={index} />
            // ))
            <>
              <NewSuggestion
                original={selectAnalyze.annotated}
                grammarCorrected={
                  selectAnalyze.grammar_corrected.corrected_annotated || ""
                }
                improved={selectAnalyze.improved
                  .map((item) => item.improved_annotated)
                  .filter(
                    (v): v is string => v !== null && typeof v === "string",
                  )}
                //    improved={
                //   selectAnalyze.improved.map(
                //     (item) => item.improved_annotated,
                //   ) || []
                // }
              />
            </>
          )}
          {selectedTab === "Feedback" && (
            <Feedback {...selectAnalyze.feedback} />
          )}
        </ScrollView>
      </View>
    </View>
  );
}
