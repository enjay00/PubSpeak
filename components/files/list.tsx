import { useAppDispatch, useAppSelector } from "@/hooks/useTypedSelector";
import {
  setIsHold,
  setRemoveSelectedMultipleFile,
  setSelectedFile,
  setSelectedMultipleFile,
} from "@/redux/fileSlice";
import { FilePath } from "@/types";
import { fileChangeEvent } from "@/utils/fileChangeEvent";
import { getFileInfo } from "@/utils/getFileInfo";
import { truncateText } from "@/utils/truncateText";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { Directory, Paths } from "expo-file-system";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import AudioFile from "../icons/audio-file";

export default function List() {
  const dispatch = useAppDispatch();
  const selectFilterFile = useAppSelector((state) => state.file.search);
  const selectIsHold = useAppSelector((state) => state.file.isHold);
  const selectSelectedMultipleFile = useAppSelector(
    (state) => state.file.selectedMultipleFile,
  );
  const [refreshing, setRefreshing] = useState(false);
  const [files, setFiles] = useState<FilePath[]>([]);

  const loadFiles = useCallback(async () => {
    try {
      const cacheDir = new Directory(Paths.cache, "Audio");
      const loadedFiles = await Promise.resolve(
        cacheDir.list() as unknown as FilePath[],
      );
      setFiles([...loadedFiles]);
    } catch (error) {
      console.error("Error loading files:", error);
    }
  }, []);

  const sortedFiles = files
    .filter((file) => file.type !== null)
    .filter((file) => {
      try {
        getFileInfo(file);
        return true;
      } catch (error) {
        return false;
      }
    })
    .sort((a, b) => {
      const timeA = Number(a.modificationTime ?? 0);
      const timeB = Number(b.modificationTime ?? 0);
      return timeB - timeA;
    })
    .filter((file) => {
      const fileName = getFileInfo(file).fullName.toLowerCase();
      return fileName.includes(selectFilterFile.toLowerCase());
    });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFiles();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [loadFiles]);

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
    <FlatList
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      data={sortedFiles}
      keyExtractor={(item) => item.uri}
      contentContainerClassName="gap-4 pt-6"
      renderItem={({ item }) => (
        <Pressable
          className="flex-row items-center justify-between"
          onPress={() => {
            router.navigate({
              pathname: "/view-result",
              params: {
                speechId: item.uri,
              },
            });
          }}
          onLongPress={(e) => {
            dispatch(setIsHold(true));
            dispatch(
              setSelectedMultipleFile([...selectSelectedMultipleFile, item]),
            );
          }}
        >
          <AudioFile />
          <View className="justify-center flex-1">
            <Text className="font-open-sans-bold text-lg text-primary-light truncate">
              {truncateText(getFileInfo(item).fullName, 25)}
            </Text>
            <Text className="font-open-sans text-primary-light truncate text-lg">
              {truncateText(
                format(
                  new Date(getFileInfo(item).modificationTime ?? 0),
                  "MMM dd yyyy h:mm a",
                ),
                30,
              )}
            </Text>
          </View>
          {selectIsHold &&
            selectSelectedMultipleFile.some((f) => f.uri === item.uri) && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color="#FFA81A"
                onPress={() => {
                  dispatch(setRemoveSelectedMultipleFile(item));
                }}
              />
            )}
          {selectIsHold &&
            !selectSelectedMultipleFile.some((f) => f.uri === item.uri) && (
              <Ionicons
                name="radio-button-off"
                size={24}
                color="#FFA81A"
                onPress={() =>
                  dispatch(
                    setSelectedMultipleFile([
                      ...selectSelectedMultipleFile,
                      item,
                    ]),
                  )
                }
              />
            )}
          {!selectIsHold && (
            <Pressable onPress={() => dispatch(setSelectedFile(item))}>
              <Entypo name="dots-three-horizontal" size={24} color="#FFFAFA" />
            </Pressable>
          )}
        </Pressable>
      )}
    />
  );
}
