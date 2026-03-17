import { useAppDispatch, useAppSelector } from "@/hooks/useTypedSelector";
import {
  cleanUpSelectedFile,
  setIsRenameModalOpen,
  setOpenDeleteModal,
  setRenameFile,
} from "@/redux/fileSlice";
import { getFileInfo } from "@/utils/getFileInfo";
import { truncateText } from "@/utils/truncateText";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { format } from "date-fns";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import AudioFile from "../icons/audio-file";

export default function ActionSheet() {
  const dispatch = useAppDispatch();
  const selectSelectedFile = useAppSelector((state) => state.file.selectedFile);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const BackdropElement = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...backdropProps}
        opacity={0.7}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  useFocusEffect(
    useCallback(() => {
      if (selectSelectedFile === null) {
        setTimeout(() => {
          bottomSheetModalRef.current?.dismiss();
        }, 100);
      }
      if (selectSelectedFile?.uri) {
        bottomSheetModalRef.current?.present();
      }
    }, [selectSelectedFile]),
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      backgroundStyle={{ backgroundColor: "#2A2A2A" }}
      handleIndicatorStyle={{ backgroundColor: "#FFFAFA", width: 100 }}
      backdropComponent={BackdropElement}
      onDismiss={() => {
        dispatch(cleanUpSelectedFile());
        bottomSheetModalRef.current?.dismiss();
      }}
    >
      <BottomSheetView style={{ padding: 16 }}>
        <View className="flex-row items-center justify-between">
          <AudioFile />
          <View className="justify-center flex-1">
            <Text className="font-open-sans-bold text-lg text-primary-light truncate">
              {selectSelectedFile &&
                truncateText(getFileInfo(selectSelectedFile).fullName, 25)}
            </Text>
            <Text className="font-open-sans text-primary-light truncate text-lg">
              {selectSelectedFile &&
                truncateText(
                  format(
                    new Date(getFileInfo(selectSelectedFile).creationTime ?? 0),
                    "MMM dd yyyy h:mm a",
                  ),
                  30,
                )}
            </Text>
          </View>
          <Entypo name="dots-three-horizontal" size={24} color="#FFFAFA" />
        </View>
        <Divider
          color="#FFFFFF"
          height={1}
          style={{
            marginTop: 16,
          }}
        />
        <View className="p-5 gap-5">
          <Pressable
            className="flex-row items-center gap-2"
            onPress={() => {
              dispatch(setIsRenameModalOpen(true));
              dispatch(setRenameFile(selectSelectedFile));
              bottomSheetModalRef.current?.dismiss();
            }}
          >
            <MaterialCommunityIcons
              name="rename-outline"
              size={24}
              color="#FFFAFA"
            />
            <Text className="font-montserrat text-xl text-primary-light">
              Rename
            </Text>
          </Pressable>
          <Pressable
            className="flex-row items-center gap-2"
            onPress={() => dispatch(setOpenDeleteModal(true))}
          >
            <MaterialCommunityIcons
              name="trash-can"
              size={24}
              color="#FF0000"
            />
            <Text className="font-montserrat text-xl text-primary-light">
              Delete
            </Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
const Divider = ({
  color = "lightgray",
  height = 1,
  style,
}: {
  color?: string;
  height?: number;
  style?: object;
}) => {
  return (
    <View
      style={[
        { width: "100%" },
        { backgroundColor: color, height: height },
        style,
      ]}
    />
  );
};
