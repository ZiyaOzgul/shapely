import { useEffect, useState } from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";
import { auth, firestore } from "@/lib/firebase";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "@react-native-firebase/auth";
import { collection, doc, getDoc } from "@react-native-firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const logoShapely = require("@/assets/shapely/logoShapely.png");

type IconName = React.ComponentProps<typeof Ionicons>["name"];

export default function ProfileScreen() {
  const theme = useTheme();
  const { isDark, setIsDark } = useThemeContext();
  const { t } = useTranslation();
  const user = auth.currentUser;
  const { profile, profileCompleteness } = useUserProfile();
  const [defaultTone, setDefaultTone] = useState("Editorial");

  useEffect(() => {
    const uid = user?.uid;
    if (!uid) return;
    getDoc(doc(collection(firestore, "users"), uid))
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data() as Record<string, unknown> | undefined;
          if (data?.defaultTone) setDefaultTone(data.defaultTone as string);
        }
      })
      .catch((err) => console.error("[Profile] Load defaultTone error:", err));
  }, []);

  const handleSignOut = async () => {
    try {
      console.log("[Profile] Signing out user:", user?.email);
      await signOut(auth);
      console.log("[Profile] Sign-out successful");
      router.replace("/");
    } catch (err) {
      console.error("[Profile] Sign-out error:", err);
    }
  };

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: verticalScale(120) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        {/* Avatar Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(80)} style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <LinearGradient
              colors={theme.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.avatar, { borderRadius: moderateScale(48) }]}
            >
              <Text
                style={[
                  styles.avatarInitial,
                  {
                    color: "#FFFFFF",
                    fontFamily: theme.typography.fonts.bold,
                    fontSize: theme.typography.sizes.xxl,
                  },
                ]}
              >
                {initials}
              </Text>
            </LinearGradient>
            {/* Edit badge */}
            <LinearGradient
              colors={theme.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.editBadge,
                {
                  borderRadius: moderateScale(12),
                  borderColor: theme.colors.background,
                },
              ]}
            >
              <Ionicons
                name="create-outline"
                size={moderateScale(12)}
                color="#FFFFFF"
              />
            </LinearGradient>
          </View>

          <Text
            style={[
              styles.displayName,
              {
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fonts.bold,
                fontSize: theme.typography.sizes.xl,
              },
            ]}
          >
            {user?.displayName ?? "User"}
          </Text>
          <Text
            style={[
              styles.email,
              {
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fonts.regular,
                fontSize: theme.typography.sizes.sm,
              },
            ]}
          >
            {user?.email ?? ""}
          </Text>
          {profile.title ? (
            <Text
              style={[
                styles.userTitle,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fonts.medium,
                  fontSize: theme.typography.sizes.xs,
                  marginTop: verticalScale(4),
                },
              ]}
            >
              {profile.title}
            </Text>
          ) : null}
        </Animated.View>

        {/* Personalization CTA */}
        {profileCompleteness < 100 && (
          <Animated.View entering={FadeInDown.duration(400).delay(140)}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/modals/edit-profile")}
              style={[
                styles.ctaCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.xl,
                },
              ]}
            >
              <View style={styles.ctaHeader}>
                <Ionicons
                  name="sparkles-outline"
                  size={moderateScale(16)}
                  color={theme.colors.primary}
                />
                <Text
                  style={[
                    styles.ctaTitle,
                    {
                      color: theme.colors.textPrimary,
                      fontFamily: theme.typography.fonts.semiBold,
                      fontSize: theme.typography.sizes.sm,
                    },
                  ]}
                >
                  {t('profile.personalizationCta')}
                </Text>
                <Text
                  style={[
                    styles.ctaPercent,
                    {
                      color: theme.colors.primary,
                      fontFamily: theme.typography.fonts.bold,
                      fontSize: theme.typography.sizes.sm,
                    },
                  ]}
                >
                  {profileCompleteness}%
                </Text>
              </View>
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
                      backgroundColor: theme.colors.primary,
                      borderRadius: theme.radius.pill,
                      width: `${profileCompleteness}%`,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.ctaSubtitle,
                  {
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.fonts.regular,
                    fontSize: theme.typography.sizes.xs,
                  },
                ]}
              >
                {t('profile.personalizationCtaSubtitle')}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Plan Card */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(160)}
          style={[
            styles.planCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.xl,
            },
          ]}
        >
          <LinearGradient
            colors={theme.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.planIcon, { borderRadius: moderateScale(20) }]}
          >
            <Ionicons name="star" size={moderateScale(20)} color="#FFFFFF" />
          </LinearGradient>
          <View style={styles.planInfo}>
            <Text
              style={[
                styles.planName,
                {
                  color: theme.colors.textPrimary,
                  fontFamily: theme.typography.fonts.bold,
                  fontSize: theme.typography.sizes.md,
                },
              ]}
            >
              {t('profile.planName')}
            </Text>
            <Text
              style={[
                styles.planLabel,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fonts.medium,
                  fontSize: theme.typography.sizes.xs,
                },
              ]}
            >
              {t('profile.activePlan')}
            </Text>
          </View>
          <TouchableOpacity activeOpacity={theme.interaction.pressScale} onPress={() => router.push("/modals/plans")}>
            <LinearGradient
              colors={theme.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.upgradeBtn, { borderRadius: theme.radius.pill }]}
            >
              <Text
                style={[
                  styles.upgradeBtnText,
                  {
                    color: "#FFFFFF",
                    fontFamily: theme.typography.fonts.semiBold,
                    fontSize: theme.typography.sizes.sm,
                  },
                ]}
              >
                {t('profile.upgrade')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* ACCOUNT section */}
        <Animated.View entering={FadeInDown.duration(400).delay(240)}>
        <SectionLabel label={t('profile.account')} theme={theme} />
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.xl,
            },
          ]}
        >
          <SettingsRow
            icon="person-outline"
            label={t('profile.editProfile')}
            onPress={() => router.push("/modals/edit-profile")}
            right={
              <Ionicons
                name="chevron-forward"
                size={moderateScale(18)}
                color={theme.colors.textSecondary}
              />
            }
            theme={theme}
          />
          <Divider theme={theme} />
          <SettingsRow
            icon="time-outline"
            label={t('profile.myReshapes')}
            onPress={() => router.push("/modals/reshapes")}
            right={
              <Ionicons
                name="chevron-forward"
                size={moderateScale(18)}
                color={theme.colors.textSecondary}
              />
            }
            theme={theme}
          />
          <Divider theme={theme} />
          <SettingsRow
            icon="lock-closed-outline"
            label={t('profile.changePassword')}
            right={
              <Ionicons
                name="chevron-forward"
                size={moderateScale(18)}
                color={theme.colors.textSecondary}
              />
            }
            theme={theme}
          />
        </View>
        </Animated.View>

        {/* PREFERENCES section */}
        <Animated.View entering={FadeInDown.duration(400).delay(320)}>
        <SectionLabel label={t('profile.preferences')} theme={theme} />
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.xl,
            },
          ]}
        >
          <SettingsRow
            icon="chatbubble-outline"
            label={t('profile.defaultTone')}
            onPress={() => router.push("/modals/default-tone")}
            right={
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: theme.colors.surfaceHigh,
                    borderRadius: theme.radius.pill,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color: theme.colors.primary,
                      fontFamily: theme.typography.fonts.semiBold,
                      fontSize: theme.typography.sizes.xs,
                    },
                  ]}
                >
                  {defaultTone}
                </Text>
              </View>
            }
            theme={theme}
          />
          <Divider theme={theme} />
          <SettingsRow
            icon="location-outline"
            label={t('profile.defaultDestination')}
            right={
              <Text
                style={[
                  styles.rowValueText,
                  {
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.fonts.regular,
                    fontSize: theme.typography.sizes.sm,
                  },
                ]}
              >
                London, UK
              </Text>
            }
            theme={theme}
          />
          <Divider theme={theme} />
          <SettingsRow
            icon="moon-outline"
            label={t('profile.darkMode')}
            right={
              <Switch
                value={isDark}
                onValueChange={setIsDark}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
                thumbColor="#FFFFFF"
              />
            }
            theme={theme}
          />
        </View>
        </Animated.View>

        {/* SUPPORT section */}
        <Animated.View entering={FadeInDown.duration(400).delay(400)}>
        <SectionLabel label={t('profile.support')} theme={theme} />
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.xl,
            },
          ]}
        >
          <SettingsRow
            icon="help-circle-outline"
            label={t('profile.helpCenter')}
            right={
              <Ionicons
                name="open-outline"
                size={moderateScale(18)}
                color={theme.colors.textSecondary}
              />
            }
            theme={theme}
          />
          <Divider theme={theme} />
          <SettingsRow
            icon="shield-outline"
            label={t('profile.privacyPolicy')}
            onPress={() => router.push("/modals/privacy")}
            right={
              <Ionicons
                name="chevron-forward"
                size={moderateScale(18)}
                color={theme.colors.textSecondary}
              />
            }
            theme={theme}
          />
        </View>
        </Animated.View>

        {/* Logout Button */}
        <Animated.View entering={FadeInDown.duration(400).delay(460)}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSignOut}
          style={[
            styles.logoutBtn,
            {
              backgroundColor: theme.colors.error + "15",
              borderColor: theme.colors.error + "40",
              borderRadius: theme.radius.xl,
            },
          ]}
        >
          <Ionicons
            name="log-out-outline"
            size={moderateScale(20)}
            color={theme.colors.error}
          />
          <Text
            style={[
              styles.logoutText,
              {
                color: theme.colors.error,
                fontFamily: theme.typography.fonts.semiBold,
                fontSize: theme.typography.sizes.md,
              },
            ]}
          >
            {t('profile.logout')}
          </Text>
        </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Internal helpers ────────────────────────────────────────────────────────

import type { AppTheme } from "@/constants/themes";

function SectionLabel({ label, theme }: { label: string; theme: AppTheme }) {
  return (
    <Text
      style={[
        styles.sectionLabel,
        {
          color: theme.colors.textSecondary,
          fontFamily: theme.typography.fonts.medium,
          fontSize: theme.typography.sizes.xs,
        },
      ]}
    >
      {label}
    </Text>
  );
}

function Divider({ theme }: { theme: AppTheme }) {
  return (
    <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
  );
}

function SettingsRow({
  icon,
  label,
  right,
  onPress,
  theme,
}: {
  icon: IconName;
  label: string;
  right: React.ReactNode;
  onPress?: () => void;
  theme: AppTheme;
}) {
  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.row} onPress={onPress}>
      <Ionicons
        name={icon}
        size={moderateScale(20)}
        color={theme.colors.textSecondary}
        style={styles.rowIcon}
      />
      <Text
        style={[
          styles.rowLabel,
          {
            color: theme.colors.textPrimary,
            fontFamily: theme.typography.fonts.medium,
            fontSize: theme.typography.sizes.md,
          },
        ]}
      >
        {label}
      </Text>
      <View style={styles.rowRight}>{right}</View>
    </TouchableOpacity>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(8),
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(24),
  },
  logoImage: {
    height: verticalScale(28),
    width: scale(110),
  },
  // Avatar
  avatarSection: {
    alignItems: "center",
    marginBottom: verticalScale(24),
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: verticalScale(12),
  },
  avatar: {
    width: moderateScale(96),
    height: moderateScale(96),
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {},
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: moderateScale(28),
    height: moderateScale(28),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  displayName: {
    marginBottom: verticalScale(4),
  },
  email: {},
  userTitle: {},
  // Personalization CTA
  ctaCard: {
    borderWidth: 1,
    padding: scale(16),
    marginBottom: verticalScale(24),
    gap: verticalScale(10),
  },
  ctaHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  ctaTitle: {
    flex: 1,
  },
  ctaPercent: {},
  progressTrack: {
    height: verticalScale(4),
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  ctaSubtitle: {},
  // Plan card
  planCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(16),
    borderWidth: 1,
    marginBottom: verticalScale(24),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: moderateScale(2) },
    shadowOpacity: 0.05,
    shadowRadius: moderateScale(8),
    elevation: 2,
  },
  planIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(12),
  },
  planInfo: {
    flex: 1,
    gap: verticalScale(2),
  },
  planName: {},
  planLabel: {
    letterSpacing: 0.8,
  },
  upgradeBtn: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
  },
  upgradeBtnText: {},
  // Sections
  sectionLabel: {
    letterSpacing: 1.2,
    marginBottom: verticalScale(8),
    marginTop: verticalScale(4),
    textTransform: "uppercase",
  },
  sectionCard: {
    borderWidth: 1,
    marginBottom: verticalScale(20),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: moderateScale(1) },
    shadowOpacity: 0.04,
    shadowRadius: moderateScale(4),
    elevation: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: scale(52),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(16),
  },
  rowIcon: {
    marginRight: scale(12),
  },
  rowLabel: {
    flex: 1,
  },
  rowRight: {
    alignItems: "flex-end",
  },
  rowValueText: {},
  badge: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
  },
  badgeText: {},
  // Logout
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(8),
    paddingVertical: verticalScale(16),
    borderWidth: 1,
  },
  logoutText: {},
});
