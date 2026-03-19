import * as schema from "@/db/schema";
import { useAppDispatch, useAppSelector } from "@/hooks/useTypedSelector";
import { cleanUpRenameFile, setIsRenameModalOpen } from "@/redux/fileSlice";
import { fileChangeEvent } from "@/utils/fileChangeEvent";
import { getFileInfo } from "@/utils/getFileInfo";
import { Ionicons } from "@expo/vector-icons";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { File, Paths } from "expo-file-system";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function RenameModal() {
  const [rename, setRename] = useState<string>("");
  const dispatch = useAppDispatch();
  const selectIsRenameModal = useAppSelector(
    (state) => state.file.isRenameModalOpen,
  );
  const selectRenameFile = useAppSelector((state) => state.file.renameFile);
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  useEffect(() => {
    if (selectIsRenameModal && selectRenameFile !== null) {
      setRename(getFileInfo(selectRenameFile).fullName);
    }
  }, [selectIsRenameModal, selectRenameFile]);

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
      onDismissRename();
    } catch (err) {
      console.error("Error renaming file:", err);
    }
  };

  const onDismissRename = () => {
    dispatch(setIsRenameModalOpen(false));
    dispatch(cleanUpRenameFile());
  };

  return (
    <Modal
      visible={selectIsRenameModal}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onDismissRename}
    >
      {/* Dark backdrop - tapping outside closes modal */}
      <TouchableWithoutFeedback onPress={onDismissRename}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Sheet rises above keyboard */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.kavWrapper}
      >
        <View style={styles.sheet}>
          <Text className="font-montserrat-bold text-2xl text-primary-light mb-10">
            Rename
          </Text>

          <View className="flex-row items-center border-b-3 border-primary-light">
            <TextInput
              className="text-primary-light text-[21px] font-open-sans flex-1"
              cursorColor={"#fff"}
              value={rename}
              onChangeText={setRename}
              autoFocus
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
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  kavWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#2A2A2A",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 32,
  },
});
