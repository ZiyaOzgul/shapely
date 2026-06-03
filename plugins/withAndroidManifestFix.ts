import { ConfigPlugin, withAndroidManifest } from "@expo/config-plugins";

const withAndroidManifestFix: ConfigPlugin = (config) => {
  return withAndroidManifest(config, async (config) => {
    const application = config.modResults.manifest.application?.[0];

    if (application?.$) {
      // Secure store'un kurallarını koru, Adapty'inkini ez
      application.$["android:dataExtractionRules"] =
        "@xml/secure_store_data_extraction_rules";
      application.$["android:fullBackupContent"] =
        "@xml/secure_store_backup_rules";

      // Merger'a "bu attribute'u replace et, merge etme" de
      application.$["xmlns:tools"] = "http://schemas.android.com/tools";
      application.$["tools:replace"] =
        "android:dataExtractionRules,android:fullBackupContent";
    }

    return config;
  });
};

export default withAndroidManifestFix;
