import { useState } from "react";
import { useTranslation } from "react-i18next";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
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
import { useThemeContext } from "@/contexts/ThemeContext";
import { useUserSettings } from "@/contexts/UserSettingsContext";
import { auth } from "@/lib/firebase";
import type { AppTheme } from "@/constants/themes";

const CLEAR_RED = "#DC2626";

const LANGUAGES: { name: string; native: string }[] = [
  { name: "English (US)", native: "English (US)" },
  { name: "English (UK)", native: "English (UK)" },
  { name: "Spanish", native: "Español" },
  { name: "French", native: "Français" },
  { name: "German", native: "Deutsch" },
  { name: "Portuguese", native: "Português" },
  { name: "Italian", native: "Italiano" },
  { name: "Dutch", native: "Nederlands" },
  { name: "Russian", native: "Русский" },
  { name: "Japanese", native: "日本語" },
  { name: "Chinese (Simplified)", native: "中文(简体)" },
  { name: "Chinese (Traditional)", native: "中文(繁體)" },
  { name: "Korean", native: "한국어" },
  { name: "Arabic", native: "العربية" },
  { name: "Hindi", native: "हिन्दी" },
  { name: "Turkish", native: "Türkçe" },
  { name: "Polish", native: "Polski" },
  { name: "Swedish", native: "Svenska" },
  { name: "Indonesian", native: "Bahasa Indonesia" },
  { name: "Vietnamese", native: "Tiếng Việt" },
];

export default function SettingsScreen() {
  const theme = useTheme();
  const { isDark, setIsDark } = useThemeContext();
  const { settings, updateSetting } = useUserSettings();
  const { t } = useTranslation();
  const user = auth.currentUser;

  const [langModalVisible, setLangModalVisible] = useState(false);

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AU";

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: verticalScale(120) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
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
          <Text
            style={[
              styles.pageTitle,
              {
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fonts.bold,
                fontSize: theme.typography.sizes.xxl,
              },
            ]}
          >
            {t('settings.title')}
          </Text>
        </Animated.View>

        {/* ── Profile Card ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(80)}>
          <View
            style={[
              styles.profileCard,
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
              style={[styles.avatar, { borderRadius: moderateScale(28) }]}
            >
              <Text
                style={[
                  styles.avatarText,
                  {
                    color: "#FFFFFF",
                    fontFamily: theme.typography.fonts.bold,
                    fontSize: theme.typography.sizes.lg,
                  },
                ]}
              >
                {initials}
              </Text>
            </LinearGradient>

            <View style={styles.profileInfo}>
              <Text
                style={[
                  styles.profileName,
                  {
                    color: theme.colors.textPrimary,
                    fontFamily: theme.typography.fonts.bold,
                    fontSize: theme.typography.sizes.md,
                  },
                ]}
                numberOfLines={1}
              >
                {user?.displayName ?? "Author"}
              </Text>
              <Text
                style={[
                  styles.profileEmail,
                  {
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.fonts.regular,
                    fontSize: theme.typography.sizes.sm,
                  },
                ]}
                numberOfLines={1}
              >
                {user?.email ?? "author@email.com"}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/modals/edit-profile")}
              style={[
                styles.editBtn,
                {
                  borderColor: theme.colors.primary,
                  borderRadius: theme.radius.pill,
                },
              ]}
            >
              <Text
                style={[
                  styles.editBtnText,
                  {
                    color: theme.colors.primary,
                    fontFamily: theme.typography.fonts.semiBold,
                    fontSize: theme.typography.sizes.sm,
                  },
                ]}
              >
                {t('settings.editProfile')}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ── AI Preferences ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(160)}>
          <SectionLabel label={t('settings.aiPreferences')} theme={theme} />
          <SettingsCard theme={theme}>
            <SettingsToggle
              label={t('settings.smartContext')}
              sublabel={t('settings.smartContextSub')}
              value={settings.smartContext}
              onValueChange={(v) => updateSetting("smartContext", v)}
              theme={theme}
            />
            <Divider theme={theme} />
            <SettingsRow
              label={t('settings.preferredTone')}
              value={settings.preferredTone}
              onPress={() => router.push("/modals/default-tone")}
              theme={theme}
            />
            <Divider theme={theme} />
            <SettingsRow
              label={t('settings.language')}
              value={settings.language}
              onPress={() => setLangModalVisible(true)}
              theme={theme}
            />
          </SettingsCard>
        </Animated.View>

        {/* ── Output Settings ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(240)}>
          <SectionLabel label={t('settings.outputSettings')} theme={theme} />
          <SettingsCard theme={theme}>
            <SettingsToggle
              label={t('settings.autoCopy')}
              value={settings.autoCopy}
              onValueChange={(v) => updateSetting("autoCopy", v)}
              theme={theme}
            />
            <Divider theme={theme} />
            <SettingsToggle
              label={t('settings.showBadge')}
              value={settings.showBadge}
              onValueChange={(v) => updateSetting("showBadge", v)}
              theme={theme}
            />
            <Divider theme={theme} />
            <SettingsRow
              label={t('settings.directExport')}
              value={t('settings.manage')}
              theme={theme}
            />
          </SettingsCard>
        </Animated.View>

        {/* ── Subscription ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(320)}>
          <SectionLabel label={t('settings.subscription')} theme={theme} />
          <SettingsCard theme={theme}>
            <View style={styles.subStatusRow}>
              <Text
                style={[
                  styles.rowLabel,
                  {
                    color: theme.colors.textPrimary,
                    fontFamily: theme.typography.fonts.regular,
                    fontSize: theme.typography.sizes.md,
                  },
                ]}
              >
                {t('settings.status')}
              </Text>
              <Text
                style={{
                  fontFamily: theme.typography.fonts.semiBold,
                  fontSize: theme.typography.sizes.md,
                }}
              >
                <Text style={{ color: theme.colors.primary }}>{t('settings.statusPro')}</Text>
                <Text
                  style={{
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.fonts.regular,
                  }}
                >
                  {t('settings.statusActive')}
                </Text>
              </Text>
            </View>
            <Divider theme={theme} />
            <TouchableOpacity activeOpacity={0.7} style={styles.manageSubBtn}>
              <Text
                style={[
                  styles.manageSubText,
                  {
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.fonts.medium,
                    fontSize: theme.typography.sizes.md,
                  },
                ]}
              >
                {t('settings.manageSubscription')}
              </Text>
            </TouchableOpacity>
          </SettingsCard>
        </Animated.View>

        {/* ── System ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(400)}>
          <SectionLabel label={t('settings.system')} theme={theme} />
          <SettingsCard theme={theme}>
            <SettingsToggle
              label={t('settings.darkMode')}
              value={isDark}
              onValueChange={setIsDark}
              theme={theme}
            />
            <Divider theme={theme} />
            <SettingsRow
              label={t('settings.pushNotifications')}
              value={t('settings.settings')}
              theme={theme}
            />
            <Divider theme={theme} />
            <TouchableOpacity activeOpacity={0.7} style={styles.clearRow}>
              <Text
                style={[
                  styles.clearText,
                  {
                    color: CLEAR_RED,
                    fontFamily: theme.typography.fonts.regular,
                    fontSize: theme.typography.sizes.md,
                  },
                ]}
              >
                {t('settings.clearHistory')}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={moderateScale(16)}
                color={CLEAR_RED}
              />
            </TouchableOpacity>
          </SettingsCard>
        </Animated.View>
      </ScrollView>

      {/* ── Language Picker Modal ── */}
      <Modal
        visible={langModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLangModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalBackdrop}
          onPress={() => setLangModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.langModal,
              {
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.xl,
              },
            ]}
          >
            {/* Modal header */}
            <View
              style={[
                styles.langModalHeader,
                { borderBottomColor: theme.colors.border },
              ]}
            >
              <Text
                style={[
                  styles.langModalTitle,
                  {
                    color: theme.colors.textPrimary,
                    fontFamily: theme.typography.fonts.bold,
                    fontSize: theme.typography.sizes.lg,
                  },
                ]}
              >
                {t('settings.selectLanguage')}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setLangModalVisible(false)}
              >
                <Ionicons
                  name="close"
                  size={moderateScale(22)}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Language list */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {LANGUAGES.map((lang, i) => {
                const selected = settings.language === lang.name;
                return (
                  <View key={lang.name}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.langRow}
                      onPress={() => {
                        updateSetting("language", lang.name);
                        setLangModalVisible(false);
                      }}
                    >
                      <View style={styles.langRowLeft}>
                        <Text
                          style={[
                            styles.langName,
                            {
                              color: selected
                                ? theme.colors.primary
                                : theme.colors.textPrimary,
                              fontFamily: selected
                                ? theme.typography.fonts.semiBold
                                : theme.typography.fonts.regular,
                              fontSize: theme.typography.sizes.md,
                            },
                          ]}
                        >
                          {lang.name}
                        </Text>
                        <Text
                          style={[
                            styles.langNative,
                            {
                              color: theme.colors.textSecondary,
                              fontFamily: theme.typography.fonts.regular,
                              fontSize: theme.typography.sizes.sm,
                            },
                          ]}
                        >
                          {lang.native}
                        </Text>
                      </View>
                      {selected && (
                        <Ionicons
                          name="checkmark"
                          size={moderateScale(20)}
                          color={theme.colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                    {i < LANGUAGES.length - 1 && <Divider theme={theme} />}
                  </View>
                );
              })}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// ─── SectionLabel ─────────────────────────────────────────────────────────────

function SectionLabel({ label, theme }: { label: string; theme: AppTheme }) {
  return (
    <Text
      style={[
        styles.sectionLabel,
        {
          color: theme.colors.textPrimary,
          fontFamily: theme.typography.fonts.bold,
          fontSize: theme.typography.sizes.lg,
        },
      ]}
    >
      {label}
    </Text>
  );
}

// ─── SettingsCard ─────────────────────────────────────────────────────────────

function SettingsCard({
  theme,
  children,
}: {
  theme: AppTheme;
  children: React.ReactNode;
}) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.xl,
        },
      ]}
    >
      {children}
    </View>
  );
}

// ─── SettingsRow ──────────────────────────────────────────────────────────────

function SettingsRow({
  label,
  value,
  onPress,
  theme,
}: {
  label: string;
  value?: string;
  onPress?: () => void;
  theme: AppTheme;
}) {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      style={styles.row}
    >
      <Text
        style={[
          styles.rowLabel,
          {
            color: theme.colors.textPrimary,
            fontFamily: theme.typography.fonts.regular,
            fontSize: theme.typography.sizes.md,
            flex: 1,
          },
        ]}
      >
        {label}
      </Text>
      {value !== undefined && (
        <View style={styles.rowRight}>
          <Text
            style={[
              styles.rowValue,
              {
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fonts.regular,
                fontSize: theme.typography.sizes.md,
              },
            ]}
          >
            {value}
          </Text>
          {onPress && (
            <Ionicons
              name="chevron-forward"
              size={moderateScale(16)}
              color={theme.colors.textSecondary}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── SettingsToggle ───────────────────────────────────────────────────────────

function SettingsToggle({
  label,
  sublabel,
  value,
  onValueChange,
  theme,
}: {
  label: string;
  sublabel?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  theme: AppTheme;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.toggleLabelWrap}>
        <Text
          style={[
            styles.rowLabel,
            {
              color: theme.colors.textPrimary,
              fontFamily: theme.typography.fonts.regular,
              fontSize: theme.typography.sizes.md,
            },
          ]}
        >
          {label}
        </Text>
        {sublabel !== undefined && (
          <Text
            style={[
              styles.rowSublabel,
              {
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fonts.regular,
                fontSize: theme.typography.sizes.sm,
              },
            ]}
          >
            {sublabel}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: theme.colors.border,
          true: theme.colors.primary,
        }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={theme.colors.border}
      />
    </View>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider({ theme }: { theme: AppTheme }) {
  return (
    <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(16),
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(20),
    gap: scale(8),
  },
  backButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    alignItems: "center",
    justifyContent: "center",
  },
  pageTitle: {},

  // Profile card
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    padding: scale(16),
    marginBottom: verticalScale(24),
    gap: scale(12),
  },
  avatar: {
    width: moderateScale(48),
    height: moderateScale(48),
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {},
  profileInfo: {
    flex: 1,
  },
  profileName: {
    marginBottom: verticalScale(2),
  },
  profileEmail: {},
  editBtn: {
    borderWidth: 1.5,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(7),
    flexShrink: 0,
  },
  editBtnText: {},

  // Section
  sectionLabel: {
    marginBottom: verticalScale(10),
  },
  card: {
    borderWidth: 1,
    marginBottom: verticalScale(24),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: moderateScale(1) },
    shadowOpacity: 0.04,
    shadowRadius: moderateScale(4),
    elevation: 1,
  },

  // Row
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    minHeight: verticalScale(52),
  },
  rowLabel: {},
  rowSublabel: {
    marginTop: verticalScale(2),
  },
  rowValue: {},
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
  },
  toggleLabelWrap: {
    flex: 1,
    marginRight: scale(12),
  },

  // Subscription
  subStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
  },
  manageSubBtn: {
    alignItems: "center",
    paddingVertical: verticalScale(14),
  },
  manageSubText: {},

  // Clear history
  clearRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
  },
  clearText: {},

  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: scale(16),
  },

  // Language modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: scale(20),
  },
  langModal: {
    width: "100%",
    maxHeight: verticalScale(480),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: moderateScale(8) },
    shadowOpacity: 0.15,
    shadowRadius: moderateScale(24),
    elevation: 8,
  },
  langModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  langModalTitle: {},
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(14),
  },
  langRowLeft: {
    flex: 1,
    marginRight: scale(12),
  },
  langName: {},
  langNative: {
    marginTop: verticalScale(2),
  },
});
