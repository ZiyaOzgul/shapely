const { withAndroidManifest } = require("@expo/config-plugins");

const withAndroidManifestFix = (config) => {
  return withAndroidManifest(config, async (config) => {
    const application = config.modResults.manifest.application?.[0];

    if (application?.$) {
      application.$["android:dataExtractionRules"] =
        "@xml/secure_store_data_extraction_rules";
      application.$["android:fullBackupContent"] =
        "@xml/secure_store_backup_rules";

      application.$["xmlns:tools"] = "http://schemas.android.com/tools";
      application.$["tools:replace"] =
        "android:dataExtractionRules,android:fullBackupContent";
    }

    return config;
  });
};

module.exports = withAndroidManifestFix;
