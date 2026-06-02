import type { AppTheme } from "@/constants/themes";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useUserSettings } from "@/contexts/UserSettingsContext";
import { useTheme } from "@/hooks/useTheme";
import { auth, firestore } from "@/lib/firebase";
import { transform } from "@/services/ai";
import { analyzeWritingStyle, shouldRefreshStyle } from "@/services/profile";
import type { RewriteRecord, UserProfile } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  type FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

// ─── Destination config ───────────────────────────────────────────────────────

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface DestinationItem {
  id: string;
  label: string;
  icon: IconName;
  brandColor: string | null; // null = use textSecondary
}

const ROW_ONE: DestinationItem[] = [
  {
    id: "LinkedIn",
    label: "LinkedIn",
    icon: "logo-linkedin",
    brandColor: "#0A66C2",
  },
  { id: "CV", label: "CV", icon: "document-text-outline", brandColor: null },
  {
    id: "Twitter",
    label: "Twitter",
    icon: "logo-twitter",
    brandColor: "#1DA1F2",
  },
  {
    id: "Slack",
    label: "Slack",
    icon: "chatbubbles-outline",
    brandColor: "#4A154B",
  },
  {
    id: "Medium",
    label: "Medium",
    icon: "newspaper-outline",
    brandColor: null,
  },
  {
    id: "WhatsApp",
    label: "WhatsApp",
    icon: "logo-whatsapp",
    brandColor: "#25D366",
  },
];

const ROW_TWO: DestinationItem[] = [
  {
    id: "Instagram",
    label: "Instagram",
    icon: "logo-instagram",
    brandColor: "#E1306C",
  },
  { id: "Email", label: "Email", icon: "mail-outline", brandColor: null },
  {
    id: "YouTube",
    label: "YouTube",
    icon: "logo-youtube",
    brandColor: "#FF0000",
  },
  { id: "Boss", label: "Boss", icon: "briefcase-outline", brandColor: null },
  { id: "Blog", label: "Blog", icon: "pencil-outline", brandColor: null },
  {
    id: "Cover Letter",
    label: "Cover Letter",
    icon: "document-outline",
    brandColor: null,
  },
];

// ─── Tone options ─────────────────────────────────────────────────────────────

const TONES = ["Professional", "Creative", "Friendly"];

// ─── Writing style refresh (fire-and-forget) ─────────────────────────────────

async function triggerStyleRefreshIfNeeded(
  uid: string,
  currentProfile: UserProfile,
  updateProfile: (patch: Partial<UserProfile>) => void,
) {
  try {
    const historyRef = collection(firestore, "users", uid, "history");
    const snap = await getDocs(historyRef);
    const count = snap.size;

    if (!shouldRefreshStyle(count, currentProfile.historyCountAtLastUpdate))
      return;

    const q = query(historyRef, orderBy("createdAt", "desc"), limit(20));
    const recentSnap = await getDocs(q);
    const originals = recentSnap.docs.map(
      (d: FirebaseFirestoreTypes.QueryDocumentSnapshot) =>
        (d.data() as RewriteRecord).original,
    );

    const style = await analyzeWritingStyle(originals);
    if (!style) return;

    updateProfile({
      writingStyle: style,
      writingStyleUpdatedAt: new Date().toISOString(),
      historyCountAtLastUpdate: count,
    });
  } catch (err) {
    console.error("[Shape] Style refresh error:", err);
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ShapeScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { settings } = useUserSettings();
  const { profile, updateProfile } = useUserProfile();
  const user = auth.currentUser;

  const [selectedDest, setSelectedDest] = useState("LinkedIn");
  const [inputText, setInputText] = useState("");
  const [selectedTone, setSelectedTone] = useState("Creative");
  const [isTransformed, setIsTransformed] = useState(false);
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const firstName = user?.displayName?.split(" ")[0] ?? "Author";

  const wordCount = inputText.trim()
    ? inputText.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const charCount = inputText.length;

  const handleSculpt = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await transform(inputText, selectedDest, selectedTone, {
        language: settings.language,
        smartContext: settings.smartContext,
        userContext: settings.smartContext ? profile : undefined,
      });
      setOutputText(result);
      setIsTransformed(true);
      const currentUser = auth.currentUser;
      if (currentUser) {
        const record: RewriteRecord = {
          id: Date.now().toString(),
          destination: selectedDest,
          tone: selectedTone,
          original: inputText.trim(),
          shaped: result,
          createdAt: new Date().toISOString(),
        };
        await addDoc(
          collection(firestore, "users", currentUser.uid, "history"),
          record,
        );
        triggerStyleRefreshIfNeeded(currentUser.uid, profile, updateProfile);
      }
    } catch (err) {
      console.error("[Shape] Transform error:", err);
      setError(t("errors.transformFailed"));
    } finally {
      setLoading(false);
    }
  };

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
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header ── */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(80)}
          style={styles.header}
        >
          <View style={styles.headerLeft}>
            <LinearGradient
              colors={theme.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.headerAvatar, { borderRadius: moderateScale(20) }]}
            >
              <Text
                style={[
                  styles.headerAvatarText,
                  {
                    color: "#FFFFFF",
                    fontFamily: theme.typography.fonts.bold,
                    fontSize: theme.typography.sizes.xs,
                  },
                ]}
              >
                {firstName.slice(0, 2).toUpperCase()}
              </Text>
            </LinearGradient>
            <Text
              style={[
                styles.headerGreeting,
                {
                  color: theme.colors.textPrimary,
                  fontFamily: theme.typography.fonts.bold,
                  fontSize: theme.typography.sizes.lg,
                },
              ]}
            >
              {t("shape.greeting", { name: firstName })}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/modals/settings")}
          >
            <Ionicons
              name="settings-outline"
              size={moderateScale(22)}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>
        </Animated.View>

        {/* ── Output Destination ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(160)}>
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
            {t("shape.outputDestination")}
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destScrollContent}
            style={styles.destScroll}
          >
            <View style={styles.destRows}>
              <View style={styles.destRow}>
                {ROW_ONE.map((item) => (
                  <DestChip
                    key={item.id}
                    item={item}
                    selected={selectedDest === item.id}
                    onPress={() => setSelectedDest(item.id)}
                    theme={theme}
                  />
                ))}
              </View>
              <View style={styles.destRow}>
                {ROW_TWO.map((item) => (
                  <DestChip
                    key={item.id}
                    item={item}
                    selected={selectedDest === item.id}
                    onPress={() => setSelectedDest(item.id)}
                    theme={theme}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
        </Animated.View>

        {/* ── Text Input Card ── */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(240)}
          style={[
            styles.inputCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.xl,
            },
          ]}
        >
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder={t("shape.placeholder")}
            placeholderTextColor={theme.colors.textDisabled}
            multiline
            style={[
              styles.textInput,
              {
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fonts.regular,
                fontSize: theme.typography.sizes.md,
              },
            ]}
          />
          <View style={styles.inputCounter}>
            <Text
              style={[
                styles.counterText,
                {
                  color: theme.colors.textDisabled,
                  fontFamily: theme.typography.fonts.regular,
                  fontSize: theme.typography.sizes.xs,
                },
              ]}
            >
              {t("shape.wordCount", { count: wordCount })}
              {"   "}
              {t("shape.charCount", { count: charCount })}
            </Text>
          </View>
        </Animated.View>

        {/* ── Tone Selector ── */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(320)}
          style={[
            styles.toneContainer,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.pill,
            },
          ]}
        >
          {TONES.map((tone) => {
            const active = selectedTone === tone;
            return (
              <TouchableOpacity
                key={tone}
                activeOpacity={0.7}
                onPress={() => setSelectedTone(tone)}
                style={[
                  styles.toneOption,
                  active && {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    borderWidth: 1,
                    borderRadius: theme.radius.pill,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: moderateScale(2) },
                    shadowOpacity: 0.08,
                    shadowRadius: moderateScale(4),
                    elevation: 3,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.toneText,
                    {
                      color: active
                        ? theme.colors.textPrimary
                        : theme.colors.textSecondary,
                      fontFamily: active
                        ? theme.typography.fonts.semiBold
                        : theme.typography.fonts.regular,
                      fontSize: theme.typography.sizes.sm,
                    },
                  ]}
                >
                  {t(`shape.tones.${tone}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {/* ── Sculpt Text Button ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(400)}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSculpt}
            disabled={loading}
          >
            <LinearGradient
              colors={theme.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.sculptBtn, { borderRadius: theme.radius.pill }]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons
                    name="color-wand-outline"
                    size={moderateScale(20)}
                    color="#FFFFFF"
                  />
                  <Text
                    style={[
                      styles.sculptBtnText,
                      {
                        color: "#FFFFFF",
                        fontFamily: theme.typography.fonts.bold,
                        fontSize: theme.typography.sizes.md,
                      },
                    ]}
                  >
                    {t("shape.sculpt")}
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Error ── */}
        {error && (
          <Text
            style={[
              styles.errorText,
              {
                color: theme.colors.error,
                fontFamily: theme.typography.fonts.regular,
                fontSize: theme.typography.sizes.sm,
              },
            ]}
          >
            {error}
          </Text>
        )}

        {/* ── Transformed Text Section ── */}
        {isTransformed && (
          <Animated.View entering={FadeInDown.duration(400)}>
            {/* Section header */}
            <View style={styles.transformedHeader}>
              <Text
                style={[
                  styles.transformedTitle,
                  {
                    color: theme.colors.textPrimary,
                    fontFamily: theme.typography.fonts.bold,
                    fontSize: theme.typography.sizes.lg,
                  },
                ]}
              >
                {t("shape.transformedTitle")}
              </Text>
              <View style={styles.transformedHeaderIcons}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.headerIconBtn}
                >
                  <Ionicons
                    name="copy-outline"
                    size={moderateScale(20)}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.headerIconBtn}
                >
                  <Ionicons
                    name="time-outline"
                    size={moderateScale(20)}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* 4 action buttons */}
            <View style={styles.actionsRow}>
              {[
                { icon: "copy-outline" as IconName, labelKey: "shape.copy" },
                { icon: "time-outline" as IconName, labelKey: "shape.history" },
                {
                  icon: "refresh-outline" as IconName,
                  labelKey: "shape.regenerate",
                },
                { icon: "share-outline" as IconName, labelKey: "shape.share" },
              ].map(({ icon, labelKey }) => (
                <TouchableOpacity
                  key={labelKey}
                  activeOpacity={0.7}
                  style={styles.actionBtn}
                >
                  <View
                    style={[
                      styles.actionIconCircle,
                      {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                        borderRadius: moderateScale(14),
                      },
                    ]}
                  >
                    <Ionicons
                      name={icon}
                      size={moderateScale(20)}
                      color={theme.colors.textSecondary}
                    />
                  </View>
                  <Text
                    style={[
                      styles.actionLabel,
                      {
                        color: theme.colors.textSecondary,
                        fontFamily: theme.typography.fonts.medium,
                        fontSize: theme.typography.sizes.xs,
                      },
                    ]}
                  >
                    {t(labelKey)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Output card */}
            <View
              style={[
                styles.outputCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.xl,
                },
              ]}
            >
              {/* Badge */}
              {settings.showBadge && (
                <View style={styles.outputBadgeRow}>
                  <LinearGradient
                    colors={theme.gradients.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      styles.outputBadge,
                      { borderRadius: theme.radius.pill },
                    ]}
                  >
                    <Text
                      style={[
                        styles.outputBadgeText,
                        {
                          color: "#FFFFFF",
                          fontFamily: theme.typography.fonts.regular,
                          fontSize: theme.typography.sizes.xs,
                        },
                      ]}
                    >
                      {t("shape.sculptedBadge")}
                    </Text>
                  </LinearGradient>
                </View>
              )}

              {/* Transformed text */}
              <Text
                style={[
                  styles.outputText,
                  {
                    color: theme.colors.textPrimary,
                    fontFamily: theme.typography.fonts.regular,
                    fontSize: theme.typography.sizes.md,
                    fontStyle: "italic",
                  },
                ]}
              >
                {outputText}
              </Text>

              {/* Footer */}
              <View style={styles.outputFooter}>
                <View style={styles.outputAvatars}>
                  {["A", "S"].map((letter, i) => (
                    <LinearGradient
                      key={letter}
                      colors={theme.gradients.primary}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[
                        styles.outputAvatar,
                        {
                          borderRadius: moderateScale(12),
                          borderColor: theme.colors.surface,
                          marginLeft: i === 0 ? 0 : -scale(6),
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.outputAvatarText,
                          {
                            color: "#FFFFFF",
                            fontFamily: theme.typography.fonts.bold,
                            fontSize: theme.typography.sizes.xs,
                          },
                        ]}
                      >
                        {letter}
                      </Text>
                    </LinearGradient>
                  ))}
                </View>
                <Text
                  style={[
                    styles.outputFooterText,
                    {
                      color: theme.colors.textSecondary,
                      fontFamily: theme.typography.fonts.regular,
                      fontSize: theme.typography.sizes.sm,
                    },
                  ]}
                >
                  {t("shape.optimizedFor", {
                    tone: t(`shape.tones.${selectedTone}`),
                    destination: t(`shape.destinations.${selectedDest}`),
                  })}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Destination Chip ─────────────────────────────────────────────────────────

function DestChip({
  item,
  selected,
  onPress,
  theme,
}: {
  item: DestinationItem;
  selected: boolean;
  onPress: () => void;
  theme: AppTheme;
}) {
  const { t } = useTranslation();
  const iconColor = selected
    ? (item.brandColor ?? theme.colors.primary)
    : theme.colors.textSecondary;
  const labelColor = selected
    ? theme.colors.primary
    : theme.colors.textSecondary;
  const bgColor = selected ? theme.colors.surfaceHigh : theme.colors.surface;
  const borderColor = selected ? theme.colors.primary : theme.colors.border;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.destChip,
        {
          backgroundColor: bgColor,
          borderColor,
          borderRadius: theme.radius.pill,
        },
      ]}
    >
      <Ionicons name={item.icon} size={moderateScale(14)} color={iconColor} />
      <Text
        style={[
          styles.destChipLabel,
          {
            color: labelColor,
            fontFamily: selected
              ? theme.typography.fonts.semiBold
              : theme.typography.fonts.regular,
            fontSize: theme.typography.sizes.sm,
          },
        ]}
      >
        {t(`shape.destinations.${item.id}`)}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1 },
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
  },
  headerAvatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatarText: {},
  headerGreeting: {},
  // Section label
  sectionLabel: {
    letterSpacing: 1.2,
    marginBottom: verticalScale(12),
    textTransform: "uppercase",
  },
  // Destination chips
  destScroll: {
    marginBottom: verticalScale(20),
    marginHorizontal: -scale(20),
  },
  destScrollContent: {
    paddingHorizontal: scale(20),
  },
  destRows: {
    flexDirection: "column",
    gap: verticalScale(8),
  },
  destRow: {
    flexDirection: "row",
    gap: scale(8),
  },
  destChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    borderWidth: 1,
  },
  destChipLabel: {},
  // Input card
  inputCard: {
    borderWidth: 1,
    marginBottom: verticalScale(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: moderateScale(2) },
    shadowOpacity: 0.04,
    shadowRadius: moderateScale(8),
    elevation: 1,
  },
  textInput: {
    padding: scale(16),
    minHeight: verticalScale(160),
    textAlignVertical: "top",
  },
  inputCounter: {
    alignItems: "flex-end",
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(12),
  },
  counterText: {},
  // Tone selector
  toneContainer: {
    flexDirection: "row",
    borderWidth: 1,
    padding: moderateScale(4),
    marginBottom: verticalScale(20),
  },
  toneOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(10),
  },
  toneText: {},
  // Sculpt button
  sculptBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(8),
    paddingVertical: verticalScale(16),
    marginBottom: verticalScale(28),
  },
  sculptBtnText: {},
  errorText: {
    textAlign: "center",
    marginTop: verticalScale(-16),
    marginBottom: verticalScale(8),
  },
  // Transformed section
  transformedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(16),
  },
  transformedTitle: {},
  transformedHeaderIcons: {
    flexDirection: "row",
    gap: scale(8),
  },
  headerIconBtn: {
    padding: scale(4),
  },
  // Action buttons
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(16),
  },
  actionBtn: {
    flex: 1,
    alignItems: "center",
    gap: verticalScale(6),
  },
  actionIconCircle: {
    width: moderateScale(52),
    height: moderateScale(52),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  actionLabel: {},
  // Output card
  outputCard: {
    borderWidth: 1,
    padding: scale(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: moderateScale(2) },
    shadowOpacity: 0.04,
    shadowRadius: moderateScale(8),
    elevation: 1,
  },
  outputBadgeRow: {
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  outputBadge: {
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(6),
  },
  outputBadgeText: {},
  outputText: {
    lineHeight: moderateScale(26),
    marginBottom: verticalScale(20),
  },
  outputFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
  },
  outputAvatars: {
    flexDirection: "row",
  },
  outputAvatar: {
    width: moderateScale(24),
    height: moderateScale(24),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  outputAvatarText: {},
  outputFooterText: {},
});
