/** @type {import('expo/config').ConfigContext} */
export default ({ config }) => ({
  ...config,

  name: "Shapely",
  slug: "shapely",
  version: "1.0.0",
  scheme: "shapely",
  owner: "lyzadev",

  sdkVersion: "55.0.0",
  platforms: ["ios", "android"],
  orientation: "portrait",
  userInterfaceStyle: "automatic",

  icon: "./assets/shapely/logoShapely.png",

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

  android: {
    package: "com.anonymous.shapely",
    versionCode: 1,
    googleServicesFile: "./google-services.json",
    predictiveBackGestureEnabled: false,
    adaptiveIcon: {
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
      backgroundColor: "#fff",
    },
  },

  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },

  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/shapely/logoShapely.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#fff",
        dark: {
          backgroundColor: "#0B1326",
        },
      },
    ],
    "expo-font",
    "expo-image",
    "expo-web-browser",
    "expo-localization",
    "expo-secure-store",
    "@react-native-firebase/app",
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
        },
        android: {
          manifestMergerEnabled: true,
          compileSdkVersion: 36,
          targetSdkVersion: 35,
          extraMavenRepos: [],
        },
      },
    ],
    "./plugins/withAndroidManifestFix",
  ],

  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },

  extra: {
    eas: {
      projectId: "0827c374-d1b0-4ef7-9fff-90cb44fbcfeb",
    },
  },
});
