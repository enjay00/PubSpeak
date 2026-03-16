import * as schema from "@/db/schema";
import { useAppSelector } from "@/hooks/useTypedSelector";
import { useGetPronunciationQuery } from "@/redux/speechApiSlice";
import { PronunciationDeviation } from "@/types";
import { Accordion } from "@animatereactnative/accordion";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useAudioPlayer } from "expo-audio";
import { File, Paths } from "expo-file-system";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";

const formatPhonemes = (phonemes: string) => {
  return phonemes.toLowerCase().split(" ").join(" · ");
};

export default function Mispronunciations(props: {
  deviations: PronunciationDeviation;
}) {
  const selectResultId = useAppSelector((state) => state.result.resultId);
  const db = useSQLiteContext();
  const { data: pronunciationData, isLoading } = useGetPronunciationQuery(
    props.deviations.word,
  );

  const hasInserted = useRef(false);

  useEffect(() => {
    (async () => {
      if (
        !isLoading &&
        pronunciationData &&
        selectResultId &&
        !hasInserted.current
      ) {
        try {
          const drizzleDb = drizzle(db, { schema });
          const files = new File(
            Paths.cache,
            "Audio",
            pronunciationData.listen_url,
          );
          drizzleDb
            .insert(schema.mispronounced)
            .values({
              word: props.deviations.word,
              url: pronunciationData?.listen_url ?? "",
              phonemes: formatPhonemes(props.deviations.expected_readable),
              localUri: files.uri,
              definition: pronunciationData?.definition ?? "",
              createdAt: new Date(),
              updatedAt: new Date(),
              speechId: parseInt(selectResultId),
            })
            .run();
          hasInserted.current = true;
        } catch (error) {
          console.error("Error inserting mispronounced word:", error);
        }
      }
    })();
  }, [
    db,
    isLoading,
    pronunciationData,
    props.deviations.expected_readable,
    props.deviations.word,
    selectResultId,
  ]);

  const audioUrl = pronunciationData?.listen_url
    ? pronunciationData.listen_url.startsWith("http")
      ? pronunciationData.listen_url
      : (process.env.EXPO_PUBLIC_API_URL ?? "") + pronunciationData.listen_url
    : null;

  const player = useAudioPlayer(audioUrl);

  const playSound = async () => {
    player.seekTo(0);
    player.play();
  };

  if (isLoading) {
    return (
      <View>
        <View className="bg-secondary-dark rounded-lg p-5 mb-8">
          <View className="flex-row items-center gap-4 mb-3">
            <View className="w-12 h-6 bg-gray-700 rounded animate-pulse" />
            <View className="flex-1 h-6 bg-gray-700 rounded animate-pulse" />
          </View>
          <View className="w-3/4 h-6 bg-gray-700 rounded animate-pulse mb-3" />
          <View className="w-full h-6 bg-gray-700 rounded animate-pulse" />
        </View>
      </View>
    );
  }

  return (
    <Accordion.Accordion
      style={{
        backgroundColor: "#2a2a2a",
        borderRadius: 10,
        marginBottom: 16,
      }}
    >
      <Accordion.Always>
        <View className="flex-row items-center justify-between rounded-lg p-5">
          <View>
            <View className="flex-row items-center gap-4">
              <Text className="font-montserrat text-base text-primary-light">
                Word:
              </Text>
              <Text className="font-montserrat-bold text-base text-primary-light">
                {props.deviations.word}
              </Text>
              <Pressable onPress={playSound}>
                <FontAwesome5 name="volume-down" size={20} color="#FFA81A" />
              </Pressable>
            </View>
            <Text className="font-montserrat-bold text-base text-primary-light">
              [{formatPhonemes(props.deviations.expected_readable)}]
            </Text>
          </View>
          <Accordion.Header>
            <Accordion.HeaderIcon>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color="#fff"
              />
            </Accordion.HeaderIcon>
          </Accordion.Header>
        </View>
      </Accordion.Always>

      <Accordion.Expanded>
        <View className="px-5 pb-5">
          <Text className="font-montserrat text-base  text-primary-light">
            Meaning: {pronunciationData?.definition}
          </Text>
        </View>
      </Accordion.Expanded>
    </Accordion.Accordion>
  );
}
