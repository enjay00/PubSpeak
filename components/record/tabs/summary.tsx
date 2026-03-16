import React from "react";
import { Text } from "react-native";

const SAMPLE_TEXT =
  "How much variation is there? Let's find <red>it</red> out.";

export const COLOR_MAP: Record<string, string> = {
  red: "#FF0000",
  yellow: "#FFD700",
  blue: "#48A7FF",
  green: "#A0FFA0",
};

export const parseStyledText = (text: string | null | undefined) => {
  if (!text) return [];

  const tagRegex = /<(red|yellow|green|blue)>(.*?)<\/\1>/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = tagRegex.exec(text)) !== null) {
    const [fullMatch, tagName, content] = match;
    const startIndex = match.index;

    // Add plain text before the tag
    if (startIndex > lastIndex) {
      parts.push(text.substring(lastIndex, startIndex));
    }

    // Add styled text
    const color = COLOR_MAP[tagName];
    parts.push(
      <Text key={parts.length} style={{ color }}>
        {content}
      </Text>,
    );

    lastIndex = tagRegex.lastIndex;
  }

  // Add remaining plain text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
};

export default function Summary({ value = SAMPLE_TEXT }: { value: string }) {
  return (
    <Text className="text-primary-light font-open-sans text-base">
      {parseStyledText(value)}
    </Text>
  );
}
