import { useEffect, useState } from "react";
import { Text } from "react-native";

interface TimerProps {
  isActive: boolean;
  onTimeChange?: (seconds: number) => void;
  className?: string;
}

export default function Timer({
  isActive,
  onTimeChange,
  className = "font-semibold text-sm text-primary-light text-center mt-5",
}: TimerProps) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive) {
      interval = setInterval(() => {
        setTime((prev) => {
          const newTime = prev + 1;
          onTimeChange?.(newTime);
          return newTime;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isActive, onTimeChange]);

  const formatTime = (centiseconds: number) => {
    const totalSeconds = Math.floor(centiseconds / 10);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const milliseconds = centiseconds % 10;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}:${milliseconds}0`;
  };

  return <Text className={className}>{formatTime(time)}</Text>;
}
