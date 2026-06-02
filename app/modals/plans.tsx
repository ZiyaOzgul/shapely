import { useState } from "react";
import { useTranslation } from "react-i18next";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/hooks/useTheme";
import { useUserPlan, getCurrentMonthKey } from "@/contexts/UserPlanContext";
import type { AppTheme } from "@/constants/themes";

// TODO: Initialize Adapty in app/_layout.tsx with activateAdapty(process.env.EXPO_PUBLIC_ADAPTY_KEY)
// TODO: Fetch paywall: const paywall = await getPaywall('YOUR_PLACEMENT_ID')
// TODO: Map paywall.products to monthly/3-month/yearly by subscriptionPeriod
// TODO: Replace PLACEHOLDER_PRICES with product.price for each period
// TODO: Call makePurchase(selectedProduct) in handleSubscribe

type Period = "monthly" | "3month" | "yearly";

// PLACEHOLDER_PRICES — replace with Adapty product prices when integrating
const PRICES: Record<Period, string> = {
  monthly: "$7.99/Month",
  "3month": "$19.99/3-Month",
  yearly: "$59.99/Year",
};

const FEATURE_KEYS: Array<keyof { adFree: string; reshapes: string; destinations: string; aiModel: string; earlyAccess: string }> = [
  "adFree",
  "reshapes",
  "destinations",
  "aiModel",
  "earlyAccess",
];

export default function PlansScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { plan, usage, isLoading: planLoading } = useUserPlan();
  const [period, setPeriod] = useState<Period>("yearly");

  const isNewGeminiMonth = usage.geminiMonthKey !== getCurrentMonthKey();
  const geminiUsed = isNewGeminiMonth ? 0 : usage.geminiCount;
  const geminiTotal = 15;
  const geminiProgress = Math.min(geminiUsed / geminiTotal, 1);

  const billingKey =
    period === "yearly"
      ? "plans.billingYearly"
      : period === "3month"
      ? "plans.billingThreeMonth"
      : "plans.billingMonthly";

  const handleSubscribe = () => {
    // TODO: makePurchase(selectedProduct) from Adapty
  };

  const periods: { key: Period; label: string }[] = [
    { key: "monthly", label: t("plans.monthly") },
    { key: "3month", label: t("plans.threeMonth") },
    { key: "yearly", label: t("plans.yearly") },
  ];

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: verticalScale(40) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Back Button ── */}
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <Ionicons
              name="chevron-back"
              size={moderateScale(24)}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>
        </Animated.View>

        {/* ── Title ── */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.titleWrap}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fonts.bold,
                fontSize: theme.typography.sizes.xxl,
              },
            ]}
          >
            {t("plans.title")}
          </Text>
        </Animated.View>

        {/* ── Usage Stats ── */}
        {!planLoading && (
          <Animated.View
            entering={FadeInDown.duration(400).delay(60)}
            style={[
              styles.statsCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.xl,
              },
            ]}
          >
            <Text
              style={[
                styles.statsTitle,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fonts.medium,
                  fontSize: theme.typography.sizes.xs,
                },
              ]}
            >
              {t(plan === "premium" ? "plans.currentPremium" : "plans.currentBasic").toUpperCase()}
            </Text>

            {plan === "premium" ? (
              <View style={styles.statRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={moderateScale(16)}
                  color={theme.colors.success}
                />
                <Text
                  style={[
                    styles.statText,
                    {
                      color: theme.colors.textPrimary,
                      fontFamily: theme.typography.fonts.medium,
                      fontSize: theme.typography.sizes.sm,
                    },
                  ]}
                >
                  {t("plans.unlimitedAccess")}
                </Text>
              </View>
            ) : (
              <>
                {/* Gemini usage bar */}
                <View style={styles.statBlock}>
                  <Text
                    style={[
                      styles.statText,
                      {
                        color: theme.colors.textPrimary,
                        fontFamily: theme.typography.fonts.medium,
                        fontSize: theme.typography.sizes.sm,
                      },
                    ]}
                  >
                    {t("plans.geminiUsage", { used: geminiUsed, total: geminiTotal })}
                  </Text>
                  <View
                    style={[
                      styles.progressTrack,
                      {
                        backgroundColor: theme.colors.border,
                        borderRadius: theme.radius.pill,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${geminiProgress * 100}%`,
                          backgroundColor:
                            geminiProgress >= 1
                              ? theme.colors.warning
                              : theme.colors.primary,
                          borderRadius: theme.radius.pill,
                        },
                      ]}
                    />
                  </View>
                </View>

                {/* GPT trial status */}
                <View style={styles.statRow}>
                  <Ionicons
                    name={usage.gptTrialUsed ? "close-circle" : "checkmark-circle"}
                    size={moderateScale(16)}
                    color={
                      usage.gptTrialUsed
                        ? theme.colors.textDisabled
                        : theme.colors.success
                    }
                  />
                  <Text
                    style={[
                      styles.statText,
                      {
                        color: usage.gptTrialUsed
                          ? theme.colors.textDisabled
                          : theme.colors.textPrimary,
                        fontFamily: theme.typography.fonts.medium,
                        fontSize: theme.typography.sizes.sm,
                      },
                    ]}
                  >
                    {t(
                      usage.gptTrialUsed
                        ? "plans.gptTrialUsed"
                        : "plans.gptTrialAvailable",
                    )}
                  </Text>
                </View>
              </>
            )}
          </Animated.View>
        )}

        {/* ── Period Selector ── */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(140)}
          style={[
            styles.periodContainer,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.pill,
            },
          ]}
        >
          {periods.map(({ key, label }) => {
            const isActive = period === key;
            const isYearly = key === "yearly";
            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.8}
                onPress={() => setPeriod(key)}
                style={styles.periodBtn}
              >
                {isActive ? (
                  <LinearGradient
                    colors={theme.gradients.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      styles.periodBtnInner,
                      { borderRadius: theme.radius.pill },
                    ]}
                  >
                    <Text
                      style={[
                        styles.periodLabel,
                        {
                          color: "#FFFFFF",
                          fontFamily: theme.typography.fonts.semiBold,
                          fontSize: theme.typography.sizes.sm,
                        },
                      ]}
                    >
                      {label}
                    </Text>
                    {isYearly && (
                      <View
                        style={[
                          styles.bestValueBadge,
                          { backgroundColor: "rgba(255,255,255,0.25)" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.bestValueText,
                            {
                              color: "#FFFFFF",
                              fontFamily: theme.typography.fonts.bold,
                              fontSize: theme.typography.sizes.xs,
                            },
                          ]}
                        >
                          {t("plans.bestValue")}
                        </Text>
                      </View>
                    )}
                  </LinearGradient>
                ) : (
                  <View style={styles.periodBtnInner}>
                    <Text
                      style={[
                        styles.periodLabel,
                        {
                          color: theme.colors.textSecondary,
                          fontFamily: theme.typography.fonts.medium,
                          fontSize: theme.typography.sizes.sm,
                        },
                      ]}
                    >
                      {label}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {/* ── Feature List ── */}
        <View style={styles.featureList}>
          {FEATURE_KEYS.map((key, idx) => (
            <Animated.View
              key={key}
              entering={FadeInDown.duration(400).delay(160 + Math.min(idx, 4) * 80)}
              style={styles.featureRow}
            >
              <LinearGradient
                colors={theme.gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.featureIconWrap,
                  { borderRadius: moderateScale(20) },
                ]}
              >
                <Ionicons
                  name="checkmark"
                  size={moderateScale(14)}
                  color="#FFFFFF"
                />
              </LinearGradient>
              <Text
                style={[
                  styles.featureLabel,
                  {
                    color: theme.colors.textPrimary,
                    fontFamily: theme.typography.fonts.medium,
                    fontSize: theme.typography.sizes.md,
                  },
                ]}
              >
                {t(`plans.features.${key}`)}
              </Text>
            </Animated.View>
          ))}
        </View>

        {/* ── Social Proof + CTA ── */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(560)}
          style={styles.ctaBlock}
        >
          {/* Social proof */}
          <View
            style={[
              styles.socialProofPill,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.pill,
              },
            ]}
          >
            <Ionicons
              name="people-outline"
              size={moderateScale(14)}
              color={theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.socialProofText,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fonts.medium,
                  fontSize: theme.typography.sizes.sm,
                },
              ]}
            >
              {t("plans.socialProof")}
            </Text>
          </View>

          {/* Subscribe button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSubscribe}
            style={styles.subscribeBtnWrap}
          >
            <LinearGradient
              colors={theme.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.subscribeBtn, { borderRadius: theme.radius.pill }]}
            >
              <Text
                style={[
                  styles.subscribeBtnText,
                  {
                    color: "#FFFFFF",
                    fontFamily: theme.typography.fonts.bold,
                    fontSize: theme.typography.sizes.md,
                  },
                ]}
              >
                {t("plans.subscribe")} — {PRICES[period]}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Billing note */}
          <Text
            style={[
              styles.billingNote,
              {
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fonts.regular,
                fontSize: theme.typography.sizes.sm,
              },
            ]}
          >
            {t(billingKey)}
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(8),
  },

  header: {
    marginBottom: verticalScale(8),
  },
  backButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    alignItems: "center",
    justifyContent: "center",
  },

  titleWrap: {
    alignItems: "center",
    marginBottom: verticalScale(28),
  },
  title: {
    textAlign: "center",
  },

  // Usage stats card
  statsCard: {
    borderWidth: 1,
    padding: scale(16),
    gap: verticalScale(12),
    marginBottom: verticalScale(20),
  },
  statsTitle: {
    letterSpacing: 1.0,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  statBlock: {
    gap: verticalScale(8),
  },
  statText: {},
  progressTrack: {
    height: verticalScale(6),
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  periodContainer: {
    flexDirection: "row",
    borderWidth: 1,
    padding: moderateScale(4),
    marginBottom: verticalScale(32),
  },
  periodBtn: {
    flex: 1,
  },
  periodBtnInner: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(4),
    gap: verticalScale(4),
  },
  periodLabel: {
    textAlign: "center",
  },
  bestValueBadge: {
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(10),
  },
  bestValueText: {
    textAlign: "center",
  },

  featureList: {
    gap: verticalScale(20),
    marginBottom: verticalScale(36),
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(14),
  },
  featureIconWrap: {
    width: moderateScale(28),
    height: moderateScale(28),
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  featureLabel: {
    flex: 1,
  },

  ctaBlock: {
    alignItems: "center",
    gap: verticalScale(14),
  },
  socialProofPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    borderWidth: 1,
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(8),
  },
  socialProofText: {},

  subscribeBtnWrap: {
    width: "100%",
  },
  subscribeBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(16),
  },
  subscribeBtnText: {},

  billingNote: {
    textAlign: "center",
  },
});
