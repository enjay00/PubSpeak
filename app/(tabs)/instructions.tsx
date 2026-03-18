import BulletList from "@/components/bullet-list";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function Instructions() {
  return (
    <ScrollView
      className="bg-primary-dark"
      contentContainerClassName="w-11/12 self-center"
    >
      <View>
        <Text className="text-primary-light font-montserrat-bold text-[28px] w-8/12">
          How to Use PubSpeaker
        </Text>
        <Text className="font-montserrat text-base text-primary-light">
          A step by step guide on how to use PubSpeaker
        </Text>
      </View>

      <View className="mt-10 gap-6">
        <View className="border border-white rounded-[37px] p-6">
          <Text className="font-montserrat-bold text-2xl text-primary-light">
            Record your speech
          </Text>
          <Text className="text-primary-light text-base font-open-sans">
            Tap the Record button and start speaking clearly. Tap Stop when
            you’re done.
          </Text>
        </View>

        <View className="border border-white rounded-[37px] p-6">
          <Text className="font-montserrat-bold text-2xl text-primary-light">
            View your feedback
          </Text>
          <Text className="text-primary-light text-base font-open-sans">
            After recording, the app will show:
          </Text>
          <BulletList
            items={[
              "Transcribed text",
              "Grammar and pronunciation errors",
              "Number of mispronounced words",
              "Suggestions",
              "Feedbacks",
            ]}
          />
        </View>

        <View className="border border-white rounded-[37px] p-6">
          <Text className="font-montserrat-bold text-2xl text-primary-light">
            Review your speech history
          </Text>
          <Text className="text-primary-light text-base font-open-sans">
            Go to the File tab to see:
          </Text>
          <BulletList items={["Past recordings", "Replay your audio"]} />
        </View>
      </View>
    </ScrollView>
  );
}
