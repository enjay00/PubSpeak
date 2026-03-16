import { useAppDispatch, useAppSelector } from "@/hooks/useTypedSelector";
import {
  cleanUpSelectedMultipleFile,
  setSearch,
  setSelectAllFiles,
} from "@/redux/fileSlice";
import { FilePath } from "@/types";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Directory, Paths } from "expo-file-system";
import React, { useCallback, useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

export default function Filter() {
  const dispatch = useAppDispatch();
  const selectSelectedMultipleFile = useAppSelector(
    (state) => state.file.selectedMultipleFile,
  );
  const selectIsHold = useAppSelector((state) => state.file.isHold);
  const [files, setFiles] = useState<FilePath[]>([]);
  const loadFiles = useCallback(() => {
    const cacheDir = new Directory(Paths.cache, "Audio");
    const loadedFiles = cacheDir.list() as unknown as FilePath[];
    setFiles(loadedFiles);
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  return (
    <View>
      <View className="flex-row items-center justify-between">
        <Text className="font-montserrat-bold text-primary-light text-xl">
          Files
        </Text>
        {selectIsHold &&
          !(selectSelectedMultipleFile.length === files.length) && (
            <Ionicons
              name="radio-button-off"
              size={24}
              color="#FFA81A"
              onPress={() => dispatch(setSelectAllFiles(files))}
            />
          )}
        {selectSelectedMultipleFile.length === files.length && selectIsHold && (
          <Ionicons
            name="checkmark-circle"
            size={24}
            color="#FFA81A"
            onPress={() => {
              dispatch(cleanUpSelectedMultipleFile());
            }}
          />
        )}
      </View>
      <View className="border border-primary-light  flex-row items-center rounded-full px-4 mt-4 gap-4 bg-secondary-dark">
        <Feather name="search" size={18} color="#FFFAFA80" />
        <TextInput
          className="text-white placeholder:text-white/50 font-open-sans text-base flex-1"
          placeholder="Search"
          onChangeText={(text) => dispatch(setSearch(text))}
        />
      </View>
    </View>
  );
}
