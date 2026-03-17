import { useAppDispatch, useAppSelector } from "@/hooks/useTypedSelector";
import { cleanUpSelectedFile, setOpenDeleteModal } from "@/redux/fileSlice";
import { fileChangeEvent } from "@/utils/fileChangeEvent";
import { getFileInfo } from "@/utils/getFileInfo";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { File, Paths } from "expo-file-system";
import React, { useCallback, useEffect, useRef } from "react";
import { Pressable, Text } from "react-native";

export default function DeleteSheet() {
  const dispatch = useAppDispatch();
  const selectSelectedFile = useAppSelector((state) => state.file.selectedFile);
  const selectOpenDeleteModal = useAppSelector(
    (state) => state.file.openDeleteModal,
  );

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const onHandleConfirmDelete = async () => {
    try {
      if (selectSelectedFile?.uri) {
        const file = new File(
          Paths.cache,
          "Audio",
          getFileInfo(selectSelectedFile).fullName,
        );
        file.delete();
        fileChangeEvent.emit("fileChangeEvent");
        bottomSheetModalRef.current?.dismiss();
        dispatch(setOpenDeleteModal(false));
        dispatch(cleanUpSelectedFile());
      }
    } catch (err) {
      console.error("Error deleting file: ", err);
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

  useEffect(() => {
    if (selectOpenDeleteModal) {
      bottomSheetModalRef.current?.present();
    }
  }, [selectOpenDeleteModal]);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      backgroundStyle={{ backgroundColor: "#2A2A2A" }}
      handleIndicatorStyle={{ backgroundColor: "#FFFAFA", width: 100 }}
      backdropComponent={BackdropElement}
    >
      <BottomSheetView style={{ padding: 16, gap: 16 }}>
        <Text className="font-montserrat-bold text-2xl text-primary-light text-center">
          Delete File
        </Text>
        <Text className="font-open-sans text-primary-light text-center">
          Are you sure you want to delete all this file?
        </Text>
        <Pressable
          className="bg-result-red h-11 rounded-full self-center w-6/12 items-center justify-center"
          onPress={onHandleConfirmDelete}
        >
          <Text className="text-primary-light font-montserrat-bold text-xl text-center">
            Confirm
          </Text>
        </Pressable>
        <Pressable
          className="bg-[#484545] h-11 rounded-full self-center w-6/12 items-center justify-center mb-6"
          onPress={() => {
            dispatch(setOpenDeleteModal(false));
            bottomSheetModalRef.current?.close();
          }}
        >
          <Text className="text-primary-light font-montserrat-bold text-xl text-center">
            Cancel
          </Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
