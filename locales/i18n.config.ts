import * as SecureStore from "expo-secure-store";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en/translation.json";
import tr from "../locales/tr/translation.json";
const LANGUAGE_STORAGE_KEY = "app_language";

const languageDetector = {
  type: "languageDetector" as const,
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      const savedLanguage = await SecureStore.getItemAsync(LANGUAGE_STORAGE_KEY);
      if (savedLanguage) {
        callback(savedLanguage);
        return;
      }
      const locales = Localization.getLocales();
      const deviceLanguage = locales[0]?.languageCode || "tr";
      callback(deviceLanguage);
    } catch (error) {
      console.error("Error detecting language:", error);
      callback("tr");
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await SecureStore.setItemAsync(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v4",
    resources: {
      en: {
        translation: en,
      },

      tr: {
        translation: tr,
      },
    },
    fallbackLng: "tr",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
