import React from "react";
import { Text } from "react-native";

export default function Transcript(props: { value: string }) {
  return (
    <Text className="text-primary-light font-open-sans text-base">
      {props.value}
    </Text>
  );
}
