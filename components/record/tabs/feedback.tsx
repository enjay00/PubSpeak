import { Feedback as FeedbackType } from "@/types/analyze";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

const ICON_MAP: Record<string, { name: string; color: string }> = {
  info: { name: "information-circle", color: "#3B82F6" },
  positive: { name: "checkmark-circle", color: "#10B981" },
  warning: { name: "close-circle", color: "#FF383E" },
};

export default function Feedback(props: FeedbackType) {
  return Object.entries(props)
    .filter(([_, items]) => Array.isArray(items))
    .map(([category, items]) => (
      <View key={category} className="bg-secondary-dark p-5 rounded-2xl mb-8">
        <Text className="font-montserrat-bold text-base text-primary-light mb-5">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Text>
        <View className="bg-primary-light/25 p-4 rounded-3xl gap-3">
          {(items as any[]).map((item, index) => {
            const icon = ICON_MAP[item.type];
            return (
              <View key={index} className="flex-row items-center gap-3">
                <Ionicons
                  name={icon.name as any}
                  size={24}
                  color={icon.color}
                />
                <Text className="text-primary-light font-montserrat text-xs flex-1">
                  {item.message}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    ));
}
