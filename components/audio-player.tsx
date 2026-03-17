import { AntDesign, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import React, { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  GestureResponderEvent,
  LayoutChangeEvent,
  Pressable,
  Text,
  View,
} from "react-native";

interface AudioPlayerProps {
  audioUri: string;
}

const formatTime = (seconds: number): string => {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function AudioPlayer({ audioUri }: AudioPlayerProps) {
  const player = useAudioPlayer(audioUri);
  const status = useAudioPlayerStatus(player);
  const [progressBarWidth, setProgressBarWidth] = React.useState(0);
  const animatedProgress = useRef(new Animated.Value(0)).current;

  const isPlaying = status.playing;
  const currentTime = status.currentTime || 0;
  const duration = status.duration || 0;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    const setupAudio = async () => {
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: false,
      });
    };
    setupAudio();
  }, []);

  useEffect(() => {
    animatedProgress.setValue(progress);
  }, [animatedProgress, progress]);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      player.pause();
    } else {
      if (duration > 0 && currentTime >= duration - 0.1) {
        player.seekTo(0);
      }
      player.play();
    }
  }, [isPlaying, player, duration, currentTime]);

  const handleFastForward = useCallback(() => {
    const newTime = Math.min(currentTime + 10, duration);
    player.seekTo(newTime);
  }, [currentTime, duration, player]);

  const handleRewind = useCallback(() => {
    const newTime = Math.max(currentTime - 10, 0);
    player.seekTo(newTime);
  }, [currentTime, player]);

  const handleProgressBarLayout = useCallback((event: LayoutChangeEvent) => {
    setProgressBarWidth(event.nativeEvent.layout.width);
  }, []);

  const handleSeek = useCallback(
    (event: GestureResponderEvent) => {
      if (progressBarWidth > 0 && duration > 0) {
        const touchX = event.nativeEvent.locationX;
        const percentage = Math.max(0, Math.min(1, touchX / progressBarWidth));
        const newTime = percentage * duration;
        player.seekTo(newTime);
      }
    },
    [progressBarWidth, duration, player],
  );

  return (
    <View className=" px-5 py-4 pb-8">
      {/* Timecode */}
      <View className="flex-row justify-between mb-3">
        <Text className="font-montserrat text-xs text-gray-400">
          {formatTime(currentTime)}
        </Text>
        <Text className="font-montserrat text-xs text-gray-400">
          {formatTime(duration)}
        </Text>
      </View>

      {/* Progress Bar */}
      <Pressable
        onLayout={handleProgressBarLayout}
        onPress={handleSeek}
        onMoveShouldSetResponder={() => true}
        onResponderMove={handleSeek}
        className="mb-4"
        hitSlop={{ top: 10, bottom: 10 }}
        style={{ height: 32 }}
      >
        <View className="flex-1 justify-center">
          <View className="h-1 bg-gray-600 rounded-full">
            <Animated.View
              className="h-full bg-primary-light rounded-full"
              style={{
                width: animatedProgress.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
              }}
            />
          </View>
          {/* Thumb indicator - circular scrubber */}
          {progressBarWidth > 0 && (
            <Animated.View
              className="absolute"
              style={{
                left: animatedProgress.interpolate({
                  inputRange: [0, 100],
                  outputRange: [-8, progressBarWidth - 8],
                }),
                top: -10,
              }}
              pointerEvents="none"
            >
              <FontAwesome name="circle" size={16} color="white" />
            </Animated.View>
          )}
        </View>
      </Pressable>

      {/* Controls */}
      <View className="flex-row justify-center items-center gap-8">
        <Pressable
          onPress={handleRewind}
          className="p-2 active:opacity-70"
          hitSlop={10}
        >
          <AntDesign name="step-backward" size={24} color="#fff" />
        </Pressable>

        <Pressable
          onPress={handlePlayPause}
          className="w-14 h-14 bg-primary-light rounded-full items-center justify-center active:opacity-80"
        >
          <FontAwesome6
            name={isPlaying ? "pause" : "play"}
            size={24}
            color="#1a1a2e"
            style={!isPlaying ? { marginLeft: 4 } : undefined}
          />
        </Pressable>

        <Pressable
          onPress={handleFastForward}
          className="p-2 active:opacity-70"
          hitSlop={10}
        >
          <AntDesign name="step-forward" size={24} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}
