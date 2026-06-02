import type { AppTheme } from "@/constants/themes";
import { useTheme } from "@/hooks/useTheme";
import { auth, firestore } from "@/lib/firebase";
import type { Tone } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  doc,
  getDoc,
  setDoc,
} from "@react-native-firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface ToneMeta {
  tone: Tone;
  icon: IconName;
  descKey: string;
}

const TONES: ToneMeta[] = [
  {
    tone: "Professional",
    icon: "briefcase-outline",
    descKey: "defaultTone.tones.professionalDesc",
  },
  {
    tone: "Friendly",
    icon: "happy-outline",
    descKey: "defaultTone.tones.friendlyDesc",
  },
  {
    tone: "Formal",
    icon: "document-text-outline",
    descKey: "defaultTone.tones.formalDesc",
  },
  {
    tone: "Editorial",
    icon: "pencil-outline",
    descKey: "defaultTone.tones.editorialDesc",
  },
  {
    tone: "Casual",
    icon: "chatbubble-outline",
    descKey: "defaultTone.tones.casualDesc",
  },
  {
    tone: "Persuasive",
    icon: "megaphone-outline",
    descKey: "defaultTone.tones.persuasiveDesc",
  },
  {
    tone: "Inspirational",
    icon: "sparkles-outline",
    descKey: "defaultTone.tones.inspirationalDesc",
  },
];

export default function DefaultToneScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Tone>("Professional");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const load = async () => {
      try {
        const snap = await getDoc(doc(collection(firestore, "users"), uid));
        if (snap.exists()) {
          const data = snap.data() as Record<string, unknown>;
          if (data.defaultTone) setSelected(data.defaultTone as Tone);
        }
      } catch (err) {
        console.error("[DefaultTone] Load error:", err);
      }
    };

    load();
  }, []);

  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    setSaving(true);
    try {
      await setDoc(
        doc(collection(firestore, "users"), uid),
        { defaultTone: selected },
        { merge: true },
      );
      router.back();
    } catch (err) {
      console.error("[DefaultTone] Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons
              name="arrow-back"
              size={moderateScale(22)}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              {
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fonts.bold,
                fontSize: theme.typography.sizes.lg,
              },
            ]}
          >
            {t("defaultTone.title")}
          </Text>
          {/* Spacer to balance back arrow */}
          <View style={styles.headerSpacer} />
        </Animated.View>

        {/* Subtitle */}
        <Animated.View entering={FadeInDown.duration(400).delay(80)}>
          <Text
            style={[
              styles.subtitle,
              {
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fonts.regular,
                fontSize: theme.typography.sizes.md,
              },
            ]}
          >
            {t("defaultTone.subtitle")}
          </Text>
        </Animated.View>

        {/* Tone list */}
        <Animated.View entering={FadeInDown.duration(400).delay(180)}>
          {TONES.map((item) => (
            <ToneRow
              key={item.tone}
              meta={item}
              isSelected={selected === item.tone}
              onSelect={setSelected}
              theme={theme}
              t={t}
            />
          ))}
        </Animated.View>

        {/* AI Suggestion card */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(300)}
          style={[
            styles.suggestionCard,
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
            style={[styles.suggestionIcon, { borderRadius: moderateScale(10) }]}
          >
            <Ionicons
              name="sparkles"
              size={moderateScale(20)}
              color="#FFFFFF"
            />
          </LinearGradient>
          <View style={styles.suggestionText}>
            <Text
              style={[
                styles.suggestionTitle,
                {
                  color: theme.colors.primary,
                  fontFamily: theme.typography.fonts.semiBold,
                  fontSize: theme.typography.sizes.md,
                },
              ]}
            >
              {t("defaultTone.aiSuggestion")}
            </Text>
            <Text
              style={[
                styles.suggestionBody,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fonts.regular,
                  fontSize: theme.typography.sizes.xs,
                },
              ]}
            >
              {t("defaultTone.aiSuggestionBody")}
            </Text>
          </View>
        </Animated.View>

        {/* Save button */}
        <Animated.View entering={FadeInDown.duration(400).delay(380)}>
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
            style={styles.saveWrapper}
          >
            <LinearGradient
              colors={theme.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.saveBtn, { borderRadius: theme.radius.pill }]}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text
                  style={[
                    styles.saveBtnText,
                    {
                      fontFamily: theme.typography.fonts.semiBold,
                      fontSize: theme.typography.sizes.md,
                    },
                  ]}
                >
                  {t("defaultTone.savePreferences")}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function ToneRow({
  meta,
  isSelected,
  onSelect,
  theme,
  t,
}: {
  meta: ToneMeta;
  isSelected: boolean;
  onSelect: (t: Tone) => void;
  theme: AppTheme;
  t: (key: string) => string;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onSelect(meta.tone)}
      style={[
        styles.toneRow,
        {
          backgroundColor: isSelected
            ? theme.colors.primary + "10"
            : theme.colors.surface,
          borderColor: isSelected ? theme.colors.primary : theme.colors.border,
          borderRadius: theme.radius.xl,
        },
      ]}
    >
      {/* Icon box */}
      <View
        style={[
          styles.toneIcon,
          {
            backgroundColor: isSelected
              ? theme.colors.primary + "15"
              : theme.colors.surfaceHigh,
            borderRadius: moderateScale(10),
          },
        ]}
      >
        <Ionicons
          name={meta.icon}
          size={moderateScale(20)}
          color={isSelected ? theme.colors.primary : theme.colors.textSecondary}
        />
      </View>

      {/* Text */}
      <View style={styles.toneTextBlock}>
        <Text
          style={[
            styles.toneName,
            {
              color: theme.colors.textPrimary,
              fontFamily: isSelected
                ? theme.typography.fonts.bold
                : theme.typography.fonts.medium,
              fontSize: theme.typography.sizes.md,
            },
          ]}
        >
          {t(`defaultTone.tones.${meta.tone}`)}
        </Text>
        <Text
          style={[
            styles.toneDesc,
            {
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.fonts.regular,
              fontSize: theme.typography.sizes.xs,
            },
          ]}
        >
          {t(meta.descKey)}
        </Text>
      </View>

      {/* Radio button */}
      <View
        style={[
          styles.radio,
          {
            borderColor: isSelected
              ? theme.colors.primary
              : theme.colors.border,
          },
        ]}
      >
        {isSelected && (
          <View
            style={[styles.radioDot, { backgroundColor: theme.colors.primary }]}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(100),
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(4),
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: moderateScale(22),
  },
  // Subtitle
  subtitle: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(24),
    lineHeight: verticalScale(22),
  },
  // Tone rows
  toneRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(16),
    borderWidth: 1,
    marginBottom: verticalScale(10),
  },
  toneIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(12),
  },
  toneTextBlock: {
    flex: 1,
    gap: verticalScale(2),
  },
  toneName: {},
  toneDesc: {},
  radio: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
  },
  // AI Suggestion card
  suggestionCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: scale(12),
    borderWidth: 1,
    padding: scale(16),
    marginTop: verticalScale(8),
    marginBottom: verticalScale(24),
  },
  suggestionIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  suggestionText: {
    flex: 1,
    gap: verticalScale(4),
  },
  suggestionTitle: {},
  suggestionBody: {
    lineHeight: verticalScale(18),
  },
  // Save button
  saveWrapper: {},
  saveBtn: {
    paddingVertical: verticalScale(16),
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    color: "#FFFFFF",
  },
});
