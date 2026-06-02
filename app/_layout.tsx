import "@/locales/i18n.config";
import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { UserSettingsProvider } from "@/contexts/UserSettingsContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { UserPlanProvider } from "@/contexts/UserPlanContext";
import * as SplashScreen from "expo-splash-screen";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  useFonts,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from "@expo-google-fonts/manrope";

SplashScreen.preventAutoHideAsync();

function AppContent({ user }: { user: FirebaseAuthTypes.User | null }) {
  const { isDark } = useThemeContext();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const inTabs = segments[0] === "(tabs)";
    const inModals = segments[0] === "modals";
    if (user && !inTabs && !inModals) {
      router.replace("/(tabs)");
    } else if (!user && (inTabs || inModals)) {
      router.replace("/");
    }
  }, [user, segments]);

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modals" options={{ presentation: "modal", headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (loaded && !authLoading) SplashScreen.hideAsync();
  }, [loaded, authLoading]);

  if (!loaded || authLoading) return null;

  return (
    <ThemeProvider>
      <UserSettingsProvider>
        <UserProfileProvider>
          <UserPlanProvider>
            <AppContent user={user} />
          </UserPlanProvider>
        </UserProfileProvider>
      </UserSettingsProvider>
    </ThemeProvider>
  );
}
