import React from "react";
import { Text, View } from "react-native";
import { parseStyledText } from "./summary";

type Suggestion = {
  original: string;
  grammarCorrected: string;
  improved: string[];
};

export default function NewSuggestion(props: Suggestion) {
  return (
    <View className="bg-secondary-dark p-5 rounded-lg">
      <View>
        <Text className="font-montserrat-bold text-base text-primary-light">
          Original
        </Text>
        <Text className="font-montserrat text-xs text-[#C0C0C0]">
          Detected text from your speech
        </Text>
        <View className="bg-primary-light/25 p-5 rounded-[17px] mt-2">
          <Text className="text-primary-light font-open-sans text-base">
            {parseStyledText(props.original)}
          </Text>
        </View>
      </View>

      <View className="mt-2">
        <Text className="font-montserrat-bold text-base text-primary-light">
          Grammar Corrected
        </Text>
        <Text className="font-montserrat text-xs text-[#C0C0C0]">
          Grammar issues fixed
        </Text>
        <View className="bg-primary-light/25 p-5 rounded-[17px] mt-2">
          <Text className="text-primary-light font-open-sans text-base">
            {parseStyledText(props.grammarCorrected)}
          </Text>
        </View>
      </View>

      <View className="mt-2">
        <Text className="font-montserrat-bold text-base text-primary-light">
<<<<<<< HEAD
          Improved Version
=======
          Original
>>>>>>> 5c9e6e7154d99abe917e80615a7b04ead0602020
        </Text>
        <Text className="font-montserrat text-xs text-[#C0C0C0]">
          Rewritten for clarity and impact
        </Text>
        {props.improved?.map((improvedText, index) =>
          improvedText ? (
            <View
              key={index}
              className="bg-primary-light/25 p-5 rounded-[17px] mt-2"
            >
              <Text className="text-primary-light font-open-sans text-base">
                {parseStyledText(improvedText)}
              </Text>
            </View>
          ) : null,
        )}
      </View>
    </View>
  );
}
