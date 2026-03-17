import { Mispronounce } from "@/redux/resultSlice";
import { Accordion } from "@animatereactnative/accordion";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import React from "react";
import { Pressable, Text, View } from "react-native";

const formatPhonemes = (phonemes: string) => {
  return phonemes.toLowerCase().split(" ").join(" · ");
};

export default function MispronunciationsLocal(props: {
  mispronunciations: Mispronounce;
}) {
  const player = useAudioPlayer(
    process.env.EXPO_PUBLIC_API_URL + props.mispronunciations.url,
  );

  const playSound = async () => {
    player.seekTo(0);
    player.play();
  };

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
                {props.mispronunciations.word}
              </Text>
              <Pressable onPress={playSound}>
                <FontAwesome5 name="volume-down" size={20} color="#FFA81A" />
              </Pressable>
            </View>
            <Text className="font-montserrat-bold text-base text-primary-light">
              [{formatPhonemes(props.mispronunciations.phonemes)}]
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
            Meaning: {props.mispronunciations.definition}
          </Text>
        </View>
      </Accordion.Expanded>
    </Accordion.Accordion>
  );
}
