import * as schema from "@/db/schema";
import { useAppDispatch, useAppSelector } from "@/hooks/useTypedSelector";
import { cleanUpRenameFile, setIsRenameModalOpen } from "@/redux/fileSlice";
import { fileChangeEvent } from "@/utils/fileChangeEvent";
import { getFileInfo } from "@/utils/getFileInfo";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { File, Paths } from "expo-file-system";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function RenameModal() {
  const [rename, setRename] = useState<string>("");
  const dispatch = useAppDispatch();
  const selectIsRenameModal = useAppSelector(
    (state) => state.file.isRenameModalOpen,
  );
  const selectRenameFile = useAppSelector((state) => state.file.renameFile);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const renameFileInfo = async () => {
    try {
      if (selectRenameFile) {
        const file = new File(
          Paths.cache,
          "Audio",
          getFileInfo(selectRenameFile).fullName,
        );
        file.rename(rename);

        const renamedFile = new File(Paths.cache, "Audio", rename);
        await drizzleDb
          .update(schema.speech)
          .set({
            audioUri: renamedFile.uri,
            updatedAt: new Date(),
          })
          .where(eq(schema.speech.audioUri, selectRenameFile.uri));
      }
      fileChangeEvent.emit("fileChangeEvent");
      dispatch(setIsRenameModalOpen(false));
      dispatch(cleanUpRenameFile());
      bottomSheetModalRef.current?.dismiss();
    } catch (err) {
      console.error("Error renaming file:", err);
    }
  };

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

  const onDismissRename = () => {
    dispatch(setIsRenameModalOpen(false));
    dispatch(cleanUpRenameFile());
    bottomSheetModalRef.current?.dismiss();
  };

  useFocusEffect(
    useCallback(() => {
      if (selectIsRenameModal) {
        bottomSheetModalRef.current?.present();
        if (selectRenameFile !== null) {
          setRename(getFileInfo(selectRenameFile).fullName);
        }
      }
    }, [selectIsRenameModal, selectRenameFile]),
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      backgroundStyle={{
        backgroundColor: "#2A2A2A",
      }}
      backdropComponent={BackdropElement}
      onDismiss={onDismissRename}
      handleComponent={null}
      enableContentPanningGesture={false}
      enableDynamicSizing
    >
      <BottomSheetView>
        <View className="rounded-2xl p-8 bg-secondary-dark">
          <Text className="font-montserrat-bold text-2xl text-primary-light mb-10">
            Rename
          </Text>
          <View className=" flex-row items-center border-b-3 border-primary-light">
            <TextInput
              className="text-primary-light text-[21px] font-open-sans flex-1"
              clearButtonMode="always"
              cursorColor={"#fff"}
              defaultValue={rename}
              onChangeText={(e) => setRename(e)}
            />
            <Pressable onPress={() => setRename("")}>
              <Ionicons name="close-circle" size={25} color="#FFFAFA" />
            </Pressable>
          </View>
          <View className="mt-6 flex-row justify-around">
            <Pressable onPress={onDismissRename}>
              <Text className="font-montserrat-bold text-2xl text-primary-light">
                Cancel
              </Text>
            </Pressable>
            <View className="w-1 h-7 bg-primary-light rounded-full" />
            <Pressable onPress={renameFileInfo}>
              <Text className="font-montserrat-bold text-2xl text-result-red">
                Save
              </Text>
            </Pressable>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
