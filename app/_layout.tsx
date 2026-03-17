import "@/assets/css/global.css";
import migrations from "@/drizzle/migrations";
import store from "@/redux/store";
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/montserrat";
import {
  OpenSans_400Regular,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";
import { AntDesign } from "@expo/vector-icons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { router, Stack } from "expo-router";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { Suspense } from "react";
import { ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Provider as ReduxProvider } from "react-redux";

export const DATABASE_NAME = "pubspeaker_dbv3";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const { success: migrationSuccess, error: migrationError } = useMigrations(
    db,
    migrations,
  );
  useDrizzleStudio(expoDb);
  const [loaded, error] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    OpenSans_400Regular,
    OpenSans_700Bold,
  });

  if ((!loaded && !error) || (!migrationSuccess && !migrationError)) {
    return null;
  }

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
        useSuspense
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <ReduxProvider store={store}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="view-result"
                  options={{
                    headerTitle: "",
                    headerStyle: {
                      backgroundColor: "#2A2A2A",
                    },
                    headerLeft: () => (
                      <AntDesign
                        name="arrow-left"
                        size={24}
                        color="#FFFAFA"
                        onPress={router.back}
                      />
                    ),
                  }}
                />
              </Stack>
              <StatusBar style="auto" />
            </ReduxProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SQLiteProvider>
    </Suspense>
  );
}
