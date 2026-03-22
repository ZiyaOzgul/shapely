import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,

  // ─── App Identity ───────────────────────────────
  name: "Shapely",
  slug: "shapely",
  version: "1.0.0",
  scheme: "shapely",

  // ─── SDK & Runtime ──────────────────────────────
  sdkVersion: "55.0.0",
  platforms: ["ios", "android"],
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  // ─── Assets ─────────────────────────────────────
  icon: "./assets/images/icon.png",

  // ─── iOS ────────────────────────────────────────
  ios: {
    bundleIdentifier: "com.anonymous.shapely",
    buildNumber: "1",
    supportsTablet: false,
    googleServicesFile: "./GoogleService-Info.plist",
    infoPlist: {
      CFBundleLocalizations: ["en", "tr", "de", "fr", "es"],
      NSCameraUsageDescription: "Used for profile photo",
    },
  },

  // ─── Android ────────────────────────────────────
  android: {
    package: "com.anonymous.shapely",
    versionCode: 1,
    googleServicesFile: "./google-services.json",
    predictiveBackGestureEnabled: false,
    adaptiveIcon: {
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
      backgroundColor: "#0B1326",
    },
  },

  // ─── Web ────────────────────────────────────────
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },

  // ─── Plugins ────────────────────────────────────
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#0B1326",
        dark: {
          backgroundColor: "#0B1326",
        },
      },
    ],
    "expo-font",
    "expo-image",
    "expo-web-browser",
    "expo-localization",
    "@react-native-firebase/app",
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
        },
      },
    ],
  ],

  // ─── Experiments ────────────────────────────────
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },

  // ─── Extra ──────────────────────────────────────
  extra: {
    eas: {
      projectId: "YOUR_PROJECT_ID",
    },
  },
});
