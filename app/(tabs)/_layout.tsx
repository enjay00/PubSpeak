import { useAppDispatch, useAppSelector } from "@/hooks/useTypedSelector";
import {
  cleanUpIsHold,
  cleanUpRenameFile,
  cleanUpSearch,
  cleanUpSelectedFile,
  cleanUpSelectedMultipleFile,
  setPreviewState,
  setRemoveSelectedMultipleFile,
} from "@/redux/fileSlice";
import { cleanUpRecordingUri, setShowState } from "@/redux/recordingSlice";
import {
  cleanUpAnalyze,
  cleanUpMispronounced,
  cleanUpResultId,
  cleanUpTranscribe,
} from "@/redux/resultSlice";
import { fileChangeEvent } from "@/utils/fileChangeEvent";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { File } from "expo-file-system";
import { router, Tabs } from "expo-router";
import { useCallback, useRef } from "react";
import { Pressable, Text, View } from "react-native";

export default function HomeLayout() {
  const dispatch = useAppDispatch();
  const selectSelectedMultipleFile = useAppSelector(
    (state) => state.file.selectedMultipleFile,
  );
  const selectIsHold = useAppSelector((state) => state.file.isHold);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const onHandleSheetOpen = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const onHandleCancelDelete = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const onHandleBack = () => {
    // Clean up recording slice
    dispatch(cleanUpRecordingUri());
    dispatch(setShowState("recording"));

    // Clean up result slice
    dispatch(cleanUpTranscribe());
    dispatch(cleanUpAnalyze());
    dispatch(cleanUpResultId());
    dispatch(cleanUpMispronounced());

    // Clean up file slice
    dispatch(setPreviewState(null));
    dispatch(cleanUpSelectedFile());
    dispatch(cleanUpSearch());
    dispatch(cleanUpRenameFile());
    dispatch(cleanUpIsHold());
    dispatch(cleanUpSelectedMultipleFile());

    router.back();
  };

  const onHandleConfirmDelete = useCallback(async () => {
    try {
      const uniqueFiles = Array.from(
        new Map(selectSelectedMultipleFile.map((f) => [f.uri, f])).values(),
      );
      for (const selectedFile of uniqueFiles) {
        console.log("Deleting file:", selectedFile.uri);
        try {
          const file = new File(selectedFile.uri);
          file.delete();
          fileChangeEvent.emit("fileChangeEvent");
          console.log("Successfully deleted:", selectedFile.uri);
          dispatch(setRemoveSelectedMultipleFile(selectedFile));
        } catch (fileError) {
          console.error("Error deleting individual file:", fileError);
        }
      }
      bottomSheetModalRef.current?.dismiss();
      dispatch(cleanUpIsHold());
      dispatch(cleanUpSelectedMultipleFile());
    } catch (error) {
      console.error("Error in delete operation:", error);
    }
  }, [selectSelectedMultipleFile, dispatch]);

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

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#2A2A2A",
            elevation: 0,
            borderTopWidth: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarActiveTintColor: "#FFA81A",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Octicons
                name="home-fill"
                size={24}
                color={focused ? "#FFA81A" : "#FFFAFA66"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="record"
          options={{
            title: "Record",
            headerTitle: "",
            tabBarActiveTintColor: "#FFA81A",
            tabBarIcon: ({ focused }) => (
              <FontAwesome
                name="microphone"
                size={24}
                color={focused ? "#FFA81A" : "#FFFAFA66"}
              />
            ),
            headerLeft: () => (
              <AntDesign
                name="arrow-left"
                size={24}
                color="#FFFAFA"
                onPress={onHandleBack}
              />
            ),
            headerLeftContainerStyle: {
              left: 12,
            },
            headerStyle: {
              backgroundColor: "#2A2A2A",
            },
          }}
        />
        <Tabs.Screen
          name="files"
          options={{
            title: "Files",
            headerTitle: "",
            tabBarActiveTintColor: "#FFA81A",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="documents-sharp"
                size={24}
                color={focused ? "#FFA81A" : "#FFFAFA66"}
              />
            ),
            headerLeft: () => (
              <AntDesign
                name="arrow-left"
                size={24}
                color="#FFFAFA"
                onPress={() => router.back()}
              />
            ),
            headerRight: () =>
              selectIsHold && (
                <View className="right-5 flex-row items-center gap-6">
                  <Pressable
                    onPress={() => {
                      dispatch(cleanUpIsHold());
                      dispatch(cleanUpSelectedMultipleFile());
                    }}
                  >
                    <Text className="text-primary-light font-montserrat-bold">
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable onPress={onHandleSheetOpen}>
                    <MaterialCommunityIcons
                      name="trash-can"
                      size={24}
                      color="#FF0000"
                    />
                  </Pressable>
                </View>
              ),
            headerLeftContainerStyle: {
              left: 12,
            },
            headerStyle: {
              backgroundColor: "#2A2A2A",
            },
          }}
        />
        <Tabs.Screen
          name="instructions"
          options={{
            href: null,
            headerTitle: "",
            headerLeft: () => (
              <AntDesign
                name="arrow-left"
                size={24}
                color="#FFFAFA"
                onPress={() => router.back()}
              />
            ),
            headerLeftContainerStyle: {
              left: 12,
            },
            headerStyle: {
              backgroundColor: "#2A2A2A",
            },
          }}
        />
        <Tabs.Screen
          name="about-us"
          options={{
            href: null,
            headerTitle: "",
            headerLeft: () => (
              <AntDesign
                name="arrow-left"
                size={24}
                color="#FFFAFA"
                onPress={() => router.back()}
              />
            ),
            headerLeftContainerStyle: {
              left: 12,
            },
            headerStyle: {
              backgroundColor: "#2A2A2A",
            },
          }}
        />
      </Tabs>
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
            onPress={onHandleCancelDelete}
          >
            <Text className="text-primary-light font-montserrat-bold text-xl text-center">
              Cancel
            </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
