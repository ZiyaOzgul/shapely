import type { AppTheme } from "@/constants/themes";
import { useTheme } from "@/hooks/useTheme";
import { auth, firestore } from "@/lib/firebase";
import type { RewriteRecord } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "@react-native-firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

// ─── Destination metadata ─────────────────────────────────────────────────────

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const DEST_META: Record<string, { icon: IconName; color: string }> = {
  LinkedIn:       { icon: "logo-linkedin",        color: "#0A66C2" },
  CV:             { icon: "document-text-outline", color: "#5865F2" },
  Twitter:        { icon: "logo-twitter",          color: "#1DA1F2" },
  Slack:          { icon: "chatbubbles-outline",   color: "#611f69" },
  Medium:         { icon: "newspaper-outline",     color: "#191919" },
  WhatsApp:       { icon: "logo-whatsapp",         color: "#25D366" },
  Instagram:      { icon: "logo-instagram",        color: "#E1306C" },
  Email:          { icon: "mail-outline",          color: "#5865F2" },
  YouTube:        { icon: "logo-youtube",          color: "#FF0000" },
  Boss:           { icon: "briefcase-outline",     color: "#5865F2" },
  Blog:           { icon: "pencil-outline",        color: "#5865F2" },
  "Cover Letter": { icon: "document-outline",     color: "#5865F2" },
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ReshapesScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [records, setRecords] = useState<RewriteRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setLoading(false);
      return;
    }
    const q = query(
      collection(firestore, "users", uid, "history"),
      orderBy("createdAt", "desc"),
    );
    getDocs(q)
      .then((snap) => {
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<RewriteRecord, "id">),
        }));
        setRecords(items);
      })
      .catch((err) => console.error("[Reshapes] Load error:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleShare = async (text: string) => {
    try {
      await Share.share({ message: text });
    } catch (err) {
      console.error("[Reshapes] Share error:", err);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: verticalScale(40) },
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
          <View>
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
              {t("reshapes.title")}
            </Text>
            {!loading && records.length > 0 && (
              <Text
                style={[
                  styles.pageSubtitle,
                  {
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.fonts.regular,
                    fontSize: theme.typography.sizes.sm,
                  },
                ]}
              >
                {t("reshapes.count", { count: records.length })}
              </Text>
            )}
          </View>
        </Animated.View>

        {/* ── Loading ── */}
        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator color={theme.colors.primary} size="large" />
          </View>
        )}

        {/* ── Empty state ── */}
        {!loading && records.length === 0 && (
          <Animated.View
            entering={FadeInDown.duration(400)}
            style={styles.emptyState}
          >
            <LinearGradient
              colors={theme.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.emptyIconWrap,
                { borderRadius: moderateScale(32) },
              ]}
            >
              <Ionicons
                name="color-wand-outline"
                size={moderateScale(32)}
                color="#FFFFFF"
              />
            </LinearGradient>
            <Text
              style={[
                styles.emptyTitle,
                {
                  color: theme.colors.textPrimary,
                  fontFamily: theme.typography.fonts.bold,
                  fontSize: theme.typography.sizes.lg,
                },
              ]}
            >
              {t("reshapes.emptyTitle")}
            </Text>
            <Text
              style={[
                styles.emptySubtitle,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fonts.regular,
                  fontSize: theme.typography.sizes.sm,
                },
              ]}
            >
              {t("reshapes.emptySubtitle")}
            </Text>
          </Animated.View>
        )}

        {/* ── Records ── */}
        {!loading &&
          records.map((record, i) => (
            <ReshapeCard
              key={record.id}
              record={record}
              index={i}
              theme={theme}
              onShare={() => handleShare(record.shaped)}
              t={t}
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Reshape Card ─────────────────────────────────────────────────────────────

function ReshapeCard({
  record,
  index,
  theme,
  onShare,
  t,
}: {
  record: RewriteRecord;
  index: number;
  theme: AppTheme;
  onShare: () => void;
  t: (key: string) => string;
}) {
  const meta = DEST_META[record.destination] ?? {
    icon: "sparkles-outline" as IconName,
    color: "#5865F2",
  };
  const delay = Math.min(index, 4) * 80;

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(delay)}>
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
        {/* Top: destination chip + tone + date */}
        <View style={styles.cardTop}>
          <View style={styles.cardTopLeft}>
            <View
              style={[
                styles.destChip,
                {
                  backgroundColor: meta.color + "18",
                  borderColor: meta.color + "40",
                  borderRadius: theme.radius.pill,
                },
              ]}
            >
              <Ionicons
                name={meta.icon}
                size={moderateScale(12)}
                color={meta.color}
              />
              <Text
                style={[
                  styles.destChipLabel,
                  {
                    color: meta.color,
                    fontFamily: theme.typography.fonts.semiBold,
                    fontSize: theme.typography.sizes.xs,
                  },
                ]}
              >
                {record.destination}
              </Text>
            </View>
            <View
              style={[
                styles.toneChip,
                {
                  backgroundColor: theme.colors.surfaceHigh,
                  borderRadius: theme.radius.pill,
                },
              ]}
            >
              <Text
                style={[
                  styles.toneChipLabel,
                  {
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.fonts.medium,
                    fontSize: theme.typography.sizes.xs,
                  },
                ]}
              >
                {record.tone}
              </Text>
            </View>
          </View>
          <Text
            style={[
              styles.dateText,
              {
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fonts.regular,
                fontSize: theme.typography.sizes.xs,
              },
            ]}
          >
            {formatDate(record.createdAt)}
          </Text>
        </View>

        {/* Shaped output text */}
        <Text
          numberOfLines={4}
          style={[
            styles.shapedText,
            {
              color: theme.colors.textPrimary,
              fontFamily: theme.typography.fonts.regular,
              fontSize: theme.typography.sizes.md,
              fontStyle: "italic",
            },
          ]}
        >
          {record.shaped}
        </Text>

        {/* Divider */}
        <View
          style={[
            styles.cardDivider,
            { backgroundColor: theme.colors.border },
          ]}
        />

        {/* Bottom: original preview + share */}
        <View style={styles.cardBottom}>
          <Text
            numberOfLines={1}
            style={[
              styles.originalText,
              {
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fonts.regular,
                fontSize: theme.typography.sizes.sm,
              },
            ]}
          >
            <Text
              style={{ fontFamily: theme.typography.fonts.semiBold }}
            >
              {t("reshapes.fromLabel")}
            </Text>
            {record.original}
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onShare}
            style={[
              styles.shareBtn,
              {
                backgroundColor: theme.colors.surfaceHigh,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.pill,
              },
            ]}
          >
            <Ionicons
              name="share-outline"
              size={moderateScale(13)}
              color={theme.colors.primary}
            />
            <Text
              style={[
                styles.shareBtnText,
                {
                  color: theme.colors.primary,
                  fontFamily: theme.typography.fonts.semiBold,
                  fontSize: theme.typography.sizes.xs,
                },
              ]}
            >
              {t("reshapes.share")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
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
    marginBottom: verticalScale(24),
    gap: scale(8),
  },
  backButton: {
    marginRight: scale(4),
  },
  pageTitle: {},
  pageSubtitle: {
    marginTop: verticalScale(2),
  },
  // Loading / empty
  centered: {
    paddingTop: verticalScale(80),
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingTop: verticalScale(72),
    paddingHorizontal: scale(32),
    gap: verticalScale(10),
  },
  emptyIconWrap: {
    width: moderateScale(72),
    height: moderateScale(72),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(4),
  },
  emptyTitle: {
    textAlign: "center",
  },
  emptySubtitle: {
    textAlign: "center",
    lineHeight: moderateScale(20),
  },
  // Card
  card: {
    borderWidth: 1,
    padding: scale(16),
    marginBottom: verticalScale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: moderateScale(2) },
    shadowOpacity: 0.04,
    shadowRadius: moderateScale(8),
    elevation: 1,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(12),
  },
  cardTopLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
  },
  destChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderWidth: 1,
  },
  destChipLabel: {},
  toneChip: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
  },
  toneChipLabel: {},
  dateText: {},
  shapedText: {
    lineHeight: moderateScale(24),
    marginBottom: verticalScale(12),
  },
  cardDivider: {
    height: StyleSheet.hairlineWidth,
    marginBottom: verticalScale(10),
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  originalText: {
    flex: 1,
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    borderWidth: 1,
  },
  shareBtnText: {},
});
