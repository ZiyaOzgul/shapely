import { AppTheme, DarkTheme, LightTheme } from "@/constants/themes";
import { useColorScheme } from "react-native";

export const useTheme = (): AppTheme => {
  const scheme = useColorScheme();
  return scheme === "dark" ? DarkTheme : LightTheme;
};
