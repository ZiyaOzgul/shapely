import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { collection, doc, getDoc, setDoc } from '@react-native-firebase/firestore';
import { auth, firestore } from '@/lib/firebase';
import type { UserSettings } from '@/types';
import i18n from '@/locales/i18n.config';

const LANG_MAP: Record<string, string> = {
  'English (US)': 'en',
  'English (UK)': 'en',
  'Turkish': 'tr',
};

const DEFAULT_SETTINGS: UserSettings = {
  smartContext: true,
  autoCopy: true,
  showBadge: true,
  language: 'English (US)',
  preferredTone: 'Professional',
};

interface UserSettingsContextValue {
  settings: UserSettings;
  updateSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void;
}

const UserSettingsContext = createContext<UserSettingsContextValue | null>(null);

export function UserSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const load = async () => {
      try {
        const snap = await getDoc(doc(collection(firestore, 'users'), uid));
        if (snap.exists()) {
          const data = snap.data() as Record<string, unknown>;
          if (data.settings && typeof data.settings === 'object') {
            setSettings({ ...DEFAULT_SETTINGS, ...(data.settings as Partial<UserSettings>) });
          }
        }
      } catch (err) {
        console.error('[UserSettings] Load error:', err);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const code = LANG_MAP[settings.language] ?? 'en';
    if (i18n.language !== code) i18n.changeLanguage(code);
  }, [settings.language]);

  const updateSetting = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K],
  ) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        try {
          await setDoc(
            doc(collection(firestore, 'users'), uid),
            { settings: next },
            { merge: true },
          );
        } catch (err) {
          console.error('[UserSettings] Save error:', err);
        }
      }, 500);

      return next;
    });
  };

  return (
    <UserSettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettings(): UserSettingsContextValue {
  const ctx = useContext(UserSettingsContext);
  if (!ctx) throw new Error('useUserSettings must be used inside UserSettingsProvider');
  return ctx;
}
