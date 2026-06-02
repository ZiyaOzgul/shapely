import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  setDoc,
} from "@react-native-firebase/firestore";
import { auth, firestore } from "@/lib/firebase";
import type { PlanTier, UserUsage } from "@/types";

export function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

const GEMINI_MONTHLY_LIMIT = 15;

const DEFAULT_USAGE: UserUsage = {
  geminiCount: 0,
  geminiMonthKey: getCurrentMonthKey(),
  gptTrialUsed: false,
  gptCount: 0,
  gptMonthKey: getCurrentMonthKey(),
};

interface UserPlanContextValue {
  plan: PlanTier;
  usage: UserUsage;
  isLoading: boolean;
  canUseGemini: () => boolean;
  canUseGPT: () => boolean;
  isGPTTrialAvailable: () => boolean;
  geminiRemaining: () => number | null;
  incrementGemini: () => Promise<void>;
  consumeGPT: () => Promise<void>;
}

const UserPlanContext = createContext<UserPlanContextValue | null>(null);

export function UserPlanProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [plan, setPlan] = useState<PlanTier>("basic");
  const [usage, setUsage] = useState<UserUsage>(DEFAULT_USAGE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        const snap = await getDoc(doc(collection(firestore, "users"), uid));
        if (snap.exists()) {
          const data = snap.data() as Record<string, unknown>;
          if (data.plan) setPlan(data.plan as PlanTier);
          if (data.usage && typeof data.usage === "object") {
            setUsage({ ...DEFAULT_USAGE, ...(data.usage as Partial<UserUsage>) });
          }
        }
      } catch (err) {
        console.error("[UserPlan] Load error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const canUseGemini = (): boolean => {
    if (plan === "premium") return true;
    if (usage.geminiMonthKey !== getCurrentMonthKey()) return true;
    return usage.geminiCount < GEMINI_MONTHLY_LIMIT;
  };

  const canUseGPT = (): boolean => {
    if (plan === "premium") return true;
    return !usage.gptTrialUsed;
  };

  const isGPTTrialAvailable = (): boolean =>
    plan === "basic" && !usage.gptTrialUsed;

  const geminiRemaining = (): number | null => {
    if (plan === "premium") return null;
    const isNewMonth = usage.geminiMonthKey !== getCurrentMonthKey();
    return isNewMonth ? GEMINI_MONTHLY_LIMIT : Math.max(0, GEMINI_MONTHLY_LIMIT - usage.geminiCount);
  };

  const incrementGemini = async (): Promise<void> => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const monthKey = getCurrentMonthKey();
    const isNewMonth = usage.geminiMonthKey !== monthKey;
    const next: UserUsage = {
      ...usage,
      geminiCount: isNewMonth ? 1 : usage.geminiCount + 1,
      geminiMonthKey: monthKey,
    };

    setUsage(next);
    try {
      await setDoc(
        doc(collection(firestore, "users"), uid),
        { usage: next },
        { merge: true },
      );
    } catch (err) {
      console.error("[UserPlan] incrementGemini error:", err);
      setUsage(usage);
    }
  };

  const consumeGPT = async (): Promise<void> => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const monthKey = getCurrentMonthKey();
    const isNewMonth = usage.gptMonthKey !== monthKey;
    const next: UserUsage =
      plan === "basic"
        ? { ...usage, gptTrialUsed: true }
        : {
            ...usage,
            gptCount: isNewMonth ? 1 : usage.gptCount + 1,
            gptMonthKey: monthKey,
          };

    setUsage(next);
    try {
      await setDoc(
        doc(collection(firestore, "users"), uid),
        { usage: next },
        { merge: true },
      );
    } catch (err) {
      console.error("[UserPlan] consumeGPT error:", err);
      setUsage(usage);
    }
  };

  return (
    <UserPlanContext.Provider
      value={{
        plan,
        usage,
        isLoading,
        canUseGemini,
        canUseGPT,
        isGPTTrialAvailable,
        geminiRemaining,
        incrementGemini,
        consumeGPT,
      }}
    >
      {children}
    </UserPlanContext.Provider>
  );
}

export function useUserPlan(): UserPlanContextValue {
  const ctx = useContext(UserPlanContext);
  if (!ctx)
    throw new Error("useUserPlan must be used inside UserPlanProvider");
  return ctx;
}
