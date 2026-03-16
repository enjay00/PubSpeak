import React from "react";
import { Text, View } from "react-native";

interface BulletListProps {
  items: string[];
  textClassName?: string;
  containerClassName?: string;
}

export default function BulletList({
  items,
  textClassName = "text-primary-light text-base font-open-sans",
}: BulletListProps) {
  return (
    <View>
      {items.map((item, index) => (
        <View key={index} className="flex-row gap-3 mb-2">
          <Text className={textClassName}>•</Text>
          <Text className={`${textClassName} flex-1`}>{item}</Text>
        </View>
      ))}
    </View>
  );
}
