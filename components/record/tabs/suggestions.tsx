import React from "react";
import { Text, View } from "react-native";

export default function Suggestions(props: { value: string }) {
  return (
    <View className="bg-secondary-dark p-5 rounded-lg mb-8">
      <Text className="text-primary-light font-open-sans text-base">
        {props.value}
      </Text>
    </View>
  );
}
