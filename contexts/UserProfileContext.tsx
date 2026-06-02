import { createContext, useContext, useEffect, useRef, useState } from "react";
import { collection, doc, getDoc, setDoc } from "@react-native-firebase/firestore";
import { auth, firestore } from "@/lib/firebase";
import type { UserProfile } from "@/types";

const DEFAULT_PROFILE: UserProfile = {
  displayName: "",
  email: "",
  photoURL: null,
  bio: "",
  title: "",
  industry: "",
  topics: [],
  audience: "",
};

interface UserProfileContextValue {
  profile: UserProfile;
  updateProfile: (patch: Partial<UserProfile>) => void;
  profileCompleteness: number;
  isLoading: boolean;
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        const snap = await getDoc(doc(collection(firestore, "users"), user.uid));
        const data = snap.exists()
          ? (snap.data() as Record<string, unknown>)
          : {};
        setProfile({
          ...DEFAULT_PROFILE,
          displayName: user.displayName ?? "",
          email: user.email ?? "",
          photoURL: user.photoURL ?? null,
          bio: (data.bio as string) ?? "",
          title: (data.title as string) ?? "",
          industry: (data.industry as string) ?? "",
          topics: (data.topics as string[]) ?? [],
          audience: (data.audience as string) ?? "",
          writingStyle: data.writingStyle as string | undefined,
          writingStyleUpdatedAt: data.writingStyleUpdatedAt as
            | string
            | undefined,
          historyCountAtLastUpdate: data.historyCountAtLastUpdate as
            | number
            | undefined,
        });
      } catch (err) {
        console.error("[UserProfile] Load error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  // Completeness: 6 meaningful fields
  const filledFields = [
    profile.displayName,
    profile.title,
    profile.bio,
    profile.industry,
    profile.audience,
    profile.topics.length > 0 ? "ok" : "",
  ].filter(Boolean).length;
  const profileCompleteness = Math.min(
    100,
    Math.floor((filledFields / 6) * 100),
  );

  const updateProfile = (patch: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        // Strip Firebase Auth-only fields — they don't live in Firestore
        const { displayName: _dn, email: _e, photoURL: _p, ...firestoreFields } = patch;
        if (Object.keys(firestoreFields).length === 0) return;
        try {
          await setDoc(
            doc(collection(firestore, "users"), uid),
            firestoreFields,
            { merge: true },
          );
        } catch (err) {
          console.error("[UserProfile] Save error:", err);
        }
      }, 500);

      return next;
    });
  };

  return (
    <UserProfileContext.Provider
      value={{ profile, updateProfile, profileCompleteness, isLoading }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile(): UserProfileContextValue {
  const ctx = useContext(UserProfileContext);
  if (!ctx)
    throw new Error("useUserProfile must be used inside UserProfileProvider");
  return ctx;
}
