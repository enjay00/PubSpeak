import AudioFile from "@/components/icons/audio-file";
import { PRIMARY_BLUE } from "@/constants/color";
import { MARGIN_TOP } from "@/constants/statusBarHeight";
import { FilePath } from "@/types";
import { fileChangeEvent } from "@/utils/fileChangeEvent";
import { getFileInfo } from "@/utils/getFileInfo";
import { truncateText } from "@/utils/truncateText";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";
import clsx from "clsx";
import { format } from "date-fns";
import { Directory, Paths } from "expo-file-system";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);
  const [files, setFiles] = useState<FilePath[]>([]);
  const loadFiles = useCallback(() => {
    try {
      const cacheDir = new Directory(Paths.cache, "Audio");
      const loadedFiles = cacheDir.list() as unknown as FilePath[];
      setFiles(loadedFiles);
    } catch (error) {
      console.error("Error loading files:", error);
    }
  }, []);

  const sortedFiles = files
    .filter((file) => file.type !== null)
    .sort((a, b) => {
      const timeA = Number(a.creationTime ?? 0);
      const timeB = Number(b.creationTime ?? 0);
      return timeB - timeA;
    });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const onFileChange = () => {
      loadFiles();
    };
    fileChangeEvent.on("fileChangeEvent", onFileChange);
    return () => {
      fileChangeEvent.off("fileChangeEvent", onFileChange);
    };
  }, [loadFiles]);

  useFocusEffect(
    useCallback(() => {
      loadFiles();
    }, [loadFiles]),
  );

  return (
    <ScrollView
      className={clsx(MARGIN_TOP)}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="self-center">
        <Image
          source={require("@/assets/images/pubspeaker-logo.png")}
          style={{ width: 138, height: 138, alignSelf: "center" }}
        />
        <Text className=" text-[28px] font-montserrat-extrabold text-primary-blue text-center">
          MAIN MENU
        </Text>
      </View>
      <View className="mt-20">
        <View className="flex-row justify-around gap-3 mx-2.5">
          <Pressable
            onPress={() => router.navigate("/record")}
            className="shadow-lg justify-center items-center  grow rounded-lg bg-secondary-light h-28"
          >
            <FontAwesome name="microphone" size={48} color={PRIMARY_BLUE} />
            <Text className="font-montserrat-medium text-lg">Record</Text>
          </Pressable>

          <Pressable
            onPress={() => router.navigate("/files")}
            className="shadow-lg justify-center items-center  grow rounded-lg bg-secondary-light h-28"
          >
            <Ionicons name="documents-sharp" size={48} color={PRIMARY_BLUE} />
            <Text className="font-montserrat-medium text-lg">Files</Text>
          </Pressable>
        </View>

        <View className="flex-row justify-around gap-3 mx-2.5 mt-4">
          <Pressable
            onPress={() => router.navigate("/instructions")}
            className="shadow-lg justify-center items-center grow rounded-lg bg-secondary-light h-28"
          >
            <Entypo
              name="text-document-inverted"
              size={48}
              color={PRIMARY_BLUE}
            />
            <Text className="font-montserrat-medium text-lg">Instructions</Text>
          </Pressable>

          <Pressable
            onPress={() => router.navigate("/about-us")}
            className="shadow-lg justify-center items-center grow rounded-lg bg-secondary-light h-28"
          >
            <FontAwesome6 name="user-group" size={48} color={PRIMARY_BLUE} />
            <Text className="font-montserrat-medium text-lg">About Us</Text>
          </Pressable>
        </View>
      </View>
      <View className="mt-6 px-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-base text-primary-blue font-montserrat-medium">
            Recent Files
          </Text>
          <Pressable
            className="flex-row items-center gap-2"
            onPress={() => router.navigate("/files")}
          >
            <Text className="text-base text-primary-blue font-montserrat-medium">
              View All
            </Text>
            <AntDesign name="arrow-right" size={14} color="black" />
          </Pressable>
        </View>
        <View className="gap-4 mt-6">
          {sortedFiles.slice(0, 3).map((file, index) => (
            <View className="flex-row flex-1" key={index}>
              <AudioFile />
              <View className="justify-center flex-1">
                <Text className="font-montserrat-bold text-lg text-primary-blue truncate">
                  {truncateText(getFileInfo(file).fullName, 28)}
                </Text>
                <Text className="font-montserrat text-primary-blue truncate">
                  {truncateText(
                    format(
                      new Date(getFileInfo(file).creationTime ?? 0),
                      "MMM dd yyyy h:mm a",
                    ),
                    30,
                  )}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
