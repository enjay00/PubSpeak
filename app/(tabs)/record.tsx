import Recording from "@/components/record/recording";
import Result from "@/components/record/result";
import { useAppSelector } from "@/hooks/useTypedSelector";
import { View } from "react-native";

export default function Record() {
  const selectShowState = useAppSelector((state) => state.recording.state);
  return (
    <View className="bg-primary-dark flex-1 ">
      {selectShowState === "recording" ? <Recording /> : <Result />}
    </View>
  );
}
