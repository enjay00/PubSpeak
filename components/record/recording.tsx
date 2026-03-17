import * as schema from "@/db/schema";
import { useAppDispatch } from "@/hooks/useTypedSelector";
import { setPreviewState } from "@/redux/fileSlice";
import { setShowState } from "@/redux/recordingSlice";
import { setAnalyze, setResultId, setTranscribe } from "@/redux/resultSlice";
import {
  usePostAnalyzeMutation,
  usePostTranscribeMutation,
} from "@/redux/speechApiSlice";
import { FilePath } from "@/types";
import { getFileInfo } from "@/utils/getFileInfo";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { drizzle } from "drizzle-orm/expo-sqlite";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import { File } from "expo-file-system";
import { useSQLiteContext } from "expo-sqlite";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import Timer from "../timer";

type RecordingState =
  | null
  | "stop"
  | "save"
  | "pause"
  | "recording"
  | "resume"
  | "error";

export default function Recording() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const dispatch = useAppDispatch();
  const [isRecording, setIsRecording] = useState<RecordingState>(null);
  const [isPrepared, setIsPrepared] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [postTranscribe] = usePostTranscribeMutation();
  const [postAnalyze] = usePostAnalyzeMutation();

  const record = async () => {
    try {
      dispatch(setPreviewState("previewFromOnRecord"));

      if (!hasPermission) {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if (!status.granted) {
          Alert.alert(
            "Microphone Permission Required",
            "Please grant microphone permission to record audio.",
          );
          return;
        }
        setHasPermission(true);
      }

      await setAudioModeAsync({
        playsInSilentMode: false,
        allowsRecording: true,
        shouldPlayInBackground: false,
      });

      if (!isPrepared) {
        await audioRecorder.prepareToRecordAsync();
        setIsPrepared(true);
      }
      audioRecorder.record();
    } catch (err) {
      console.error("Failed to record", err);
      setIsPrepared(false);
      Alert.alert(
        "Recording Error",
        "Failed to start recording. Please try again.",
      );
    }
  };

  const pauseRecording = async () => {
    try {
      await audioRecorder.pause();
      // Reset audio mode when pausing to prevent feedback
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: false,
        shouldPlayInBackground: false,
      });
    } catch (err) {
      console.error("Failed to pause recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      setIsPrepared(false);

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: false,
      });

      if (audioRecorder.uri) {
        const files = new File(audioRecorder.uri);
        const { fullName } = getFileInfo(files as unknown as FilePath);
        const data = {
          uri: files.uri,
          name: fullName,
          type: files.type,
        };
        const postTranscribeResponse = await postTranscribe(data).unwrap();
        const postAnalyzeResponse = await postAnalyze(
          postTranscribeResponse.audio_path,
        ).unwrap();
        console.log(
          "Transcribe",
          JSON.stringify(postTranscribeResponse, null, 2),
        );
        console.log("Analyze", JSON.stringify(postAnalyzeResponse, null, 2));

        dispatch(setTranscribe(postTranscribeResponse));
        dispatch(setAnalyze(postAnalyzeResponse));

        const speechResult = await drizzleDb.insert(schema.speech).values({
          audioUri: files.uri,
          transcribe: postTranscribeResponse.text,
          summary: postAnalyzeResponse.annotated,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const speechId = speechResult.lastInsertRowId;

        await Promise.all([
          ...postAnalyzeResponse.suggestions.map((suggestion) =>
            drizzleDb
              .insert(schema.suggestions)
              .values({
                suggestion: suggestion,
                grammarCorrected:
                  postAnalyzeResponse.grammar_corrected.corrected_annotated ??
                  "",
                improved: JSON.stringify(postAnalyzeResponse.improved),
                speechId: speechId,
                createdAt: new Date(),
                updatedAt: new Date(),
              })
              .run(),
          ),
          drizzleDb
            .insert(schema.feedback)
            .values({
              pronunciation: postAnalyzeResponse.feedback.pronunciation,
              grammar: postAnalyzeResponse.feedback.grammar,
              pace: postAnalyzeResponse.feedback.pace,
              speechId: speechId,
              createdAt: new Date(),
              updatedAt: new Date(),
            })
            .run(),
        ]);

        dispatch(setResultId(speechId.toString()));
      }
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  const handlePress = async (state: RecordingState) => {
    setIsRecording(state);
    if (state === "recording") {
      return record();
    }
    if (state === "pause") {
      return pauseRecording();
    }
    if (state === "save" || state === "stop") {
      await stopRecording();
      setTimeout(() => {
        setIsRecording(null);
        dispatch(setShowState("result"));
      }, 3000);
    }
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      setHasPermission(status.granted);
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
        return;
      }
    })();

    // Cleanup function - stop any recording and reset audio mode
    return () => {
      setIsPrepared(false);
      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: false,
        shouldPlayInBackground: false,
      }).catch((err) =>
        console.error("Failed to reset audio mode on unmount", err),
      );
    };
  }, []);

  return (
    <View className="flex-1 justify-center items-center">
      {isRecording === "save" && (
        <LottieView
          source={require("@/assets/lottie/Insider-loading.json")}
          style={{
            width: 500,
            height: 500,
          }}
          autoPlay
          loop
        />
      )}
      {(isRecording === null ||
        isRecording === "recording" ||
        isRecording === "pause") && (
        <View className="w-11/12 h-auto relative flex justify-center items-center">
          <LottieView
            source={require("@/assets/lottie/Red Circle.json")}
            style={{
              width: 156 * 2,
              height: 156 * 2,
              borderWidth: 1,
              borderColor: "blue",
            }}
            autoPlay={isRecording === "recording"}
            progress={isRecording === "recording" ? 0.5 : 0}
            loop={isRecording === "recording"}
          />
          <View className="absolute">
            <Ionicons name="mic-outline" size={67} color={"#FFA81A"} />
          </View>
          <Timer
            isActive={isRecording === "recording"}
            className=" absolute bottom-10 text-center text-white"
          />
        </View>
      )}
      {isRecording === "error" && (
        <View className="relative flex justify-center items-center h-39 w-39 bg-result-red rounded-full">
          <View className="absolute">
            <Ionicons name="mic-outline" size={67} color={"#FFA81A"} />
          </View>
        </View>
      )}

      <View className="absolute bottom-6">
        {/* Start Recording Controls (Play - Pause) */}
        {isRecording === "recording" && (
          <Pressable
            onPress={() => handlePress("pause")}
            className="bg-secondary-dark h-16 w-16 justify-center items-center self-center rounded-full mb-6"
          >
            <Ionicons name="pause" size={24} color="#FFFAFA" />
          </Pressable>
        )}
        {isRecording === "pause" && (
          <Pressable
            onPress={() => handlePress("recording")}
            className="bg-secondary-dark h-16 w-16 justify-center items-center self-center rounded-full mb-6"
          >
            <Ionicons name="play" size={24} color="#FFFAFA" />
          </Pressable>
        )}
        {/* End Recording Controls (Play - Pause) */}
        {isRecording === null && (
          <Pressable
            onPress={() => handlePress("recording")}
            className="bg-primary-light p-3 rounded-full"
          >
            <Text className="font-montserrat-bold text-base text-black">
              Tap to Speak
            </Text>
          </Pressable>
        )}
        {/* Start Recording State */}
        {(isRecording === "recording" || isRecording === "pause") && (
          <Pressable
            onPress={() => handlePress("save")}
            className="bg-primary-light p-3 rounded-full"
          >
            <Text className="font-montserrat-bold text-base">
              Stop Recording
            </Text>
          </Pressable>
        )}
        {/* End Recording State */}
        {/* Start Error State */}
        {isRecording === "error" && (
          <>
            <Text className="font-open-sans text-base text-primary-light mb-4">
              Voice unclear. Try speaking again.
            </Text>
            <Pressable
              onPress={() => handlePress("recording")}
              className="bg-primary-light p-3 rounded-full self-center"
            >
              <Text className="font-montserrat-bold text-base text-black">
                Try again
              </Text>
            </Pressable>
          </>
        )}
        {/* End Error State */}
        {/* Start Save State */}
        {isRecording === "save" && (
          <Pressable
            onPress={() => handlePress("save")}
            className="bg-primary-light p-3 rounded-full flex-row items-center justify-center"
          >
            <MaterialIcons name="mic" size={24} color="black" />
            <Text className="font-montserrat-bold text-base">Record Saved</Text>
          </Pressable>
        )}
        {/* End Save State */}
      </View>
    </View>
  );
}
