import type { AppTheme } from "@/constants/themes";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

// ─── Home Screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

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
        {/* ── Hero ── */}
        <View style={styles.hero}>
          {/* Badge pill */}
          <Animated.View entering={FadeIn.duration(400)}>
            <View
              style={[
                styles.badgePill,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.pill,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.fonts.semiBold,
                    fontSize: moderateScale(10),
                  },
                ]}
              >
                {t('home.badge')}
              </Text>
            </View>
          </Animated.View>

          {/* Headline */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(80)}
            style={styles.headlineContainer}
          >
            <Text
              style={[
                styles.headlineLine,
                {
                  color: theme.colors.textPrimary,
                  fontFamily: theme.typography.fonts.bold,
                  fontSize: moderateScale(36),
                },
              ]}
            >
              {t('home.headline')}
            </Text>
            <Text
              style={[
                styles.headlineAccent,
                {
                  color: theme.colors.primary,
                  fontFamily: theme.typography.fonts.bold,
                  fontSize: moderateScale(36),
                },
              ]}
            >
              {t('home.headlineAccent')}
            </Text>
          </Animated.View>

          {/* Subtitle + CTAs */}
          <Animated.View entering={FadeInDown.duration(400).delay(160)}>
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fonts.regular,
                  fontSize: theme.typography.sizes.sm,
                },
              ]}
            >
              {t('home.subtitle')}
            </Text>

            <View style={styles.ctaRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push("/(tabs)/shape")}
                style={styles.ctaPrimary}
              >
                <LinearGradient
                  colors={theme.gradients.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.ctaPrimaryGradient,
                    { borderRadius: theme.radius.pill },
                  ]}
                >
                  <Text
                    style={[
                      styles.ctaPrimaryText,
                      {
                        color: "#FFFFFF",
                        fontFamily: theme.typography.fonts.semiBold,
                        fontSize: theme.typography.sizes.md,
                      },
                    ]}
                  >
                    {t('home.startShaping')}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.ctaSecondary,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    borderRadius: theme.radius.pill,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.ctaSecondaryText,
                    {
                      color: theme.colors.textPrimary,
                      fontFamily: theme.typography.fonts.semiBold,
                      fontSize: theme.typography.sizes.md,
                    },
                  ]}
                >
                  {t('home.watchDemo')}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>

        {/* ── Tone Selection Card ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(240)}>
          <FeatureCard
            theme={theme}
            iconName="options-outline"
            title={t('home.toneSelectionTitle')}
            description={t('home.toneSelectionDesc')}
          >
            <View style={styles.chipsRow}>
              {[
                t('home.toneChips.professional'),
                t('home.toneChips.empathetic'),
                t('home.toneChips.provocative'),
                t('home.toneChips.minimalist'),
              ].map(
                (tone, i) => (
                  <ToneChip
                    key={tone}
                    label={tone}
                    active={i === 0}
                    theme={theme}
                  />
                ),
              )}
            </View>
          </FeatureCard>
        </Animated.View>

        {/* ── Destinations Card ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(320)}>
          <FeatureCard
            theme={theme}
            iconName="play-outline"
            title={t('home.destinationsTitle')}
            description={t('home.destinationsDesc')}
          >
            <View style={styles.destIconsRow}>
              <DestinationIcon iconName="at-outline" theme={theme} />
              <DestinationIcon iconName="chatbubble-outline" theme={theme} />
              <DestinationIcon iconName="globe-outline" theme={theme} />
            </View>
          </FeatureCard>
        </Animated.View>

        {/* ── Testimonial ── */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(400)}
          style={[styles.testimonialCard, { borderRadius: theme.radius.xl }]}
        >
          <Text
            style={[
              styles.testimonialTitle,
              {
                color: "#FFFFFF",
                fontFamily: theme.typography.fonts.bold,
                fontSize: theme.typography.sizes.xxl,
              },
            ]}
          >
            {t('home.lovedBy')}
          </Text>
          <Text
            style={[
              styles.testimonialQuote,
              {
                color: "rgba(255,255,255,0.75)",
                fontFamily: theme.typography.fonts.regular,
                fontSize: theme.typography.sizes.md,
              },
            ]}
          >
            {t('home.testimonialQuote')}
          </Text>
          <View style={styles.testimonialAuthorRow}>
            <LinearGradient
              colors={theme.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.testimonialAvatar,
                { borderRadius: moderateScale(20) },
              ]}
            >
              <Text
                style={[
                  styles.testimonialAvatarText,
                  {
                    color: "#FFFFFF",
                    fontFamily: theme.typography.fonts.bold,
                    fontSize: theme.typography.sizes.sm,
                  },
                ]}
              >
                AR
              </Text>
            </LinearGradient>
            <View>
              <Text
                style={[
                  styles.testimonialName,
                  {
                    color: "#FFFFFF",
                    fontFamily: theme.typography.fonts.semiBold,
                    fontSize: theme.typography.sizes.sm,
                  },
                ]}
              >
                {t('home.testimonialName')}
              </Text>
              <Text
                style={[
                  styles.testimonialRole,
                  {
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: theme.typography.fonts.regular,
                    fontSize: moderateScale(11),
                  },
                ]}
              >
                {t('home.testimonialRole')}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* ── Bottom CTA ── */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(480)}
          style={styles.bottomCta}
        >
          <Text
            style={[
              styles.bottomCtaTitle,
              {
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fonts.bold,
                fontSize: theme.typography.sizes.xxl,
              },
            ]}
          >
            {t('home.readyTitle')}
          </Text>
          <LinearGradient
            colors={theme.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.aiPulseBadge, { borderRadius: theme.radius.pill }]}
          >
            <Text
              style={[
                styles.aiPulseText,
                {
                  color: "#FFFFFF",
                  fontFamily: theme.typography.fonts.semiBold,
                  fontSize: moderateScale(10),
                },
              ]}
            >
              {t('home.aiPulseBadge')}
            </Text>
          </LinearGradient>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)/shape")}
            style={[
              styles.inputPreview,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.lg,
              },
            ]}
          >
            <Ionicons
              name="sparkles-outline"
              size={moderateScale(18)}
              color={theme.colors.primary}
            />
            <Text
              style={[
                styles.inputPreviewText,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fonts.regular,
                  fontSize: theme.typography.sizes.sm,
                },
              ]}
            >
              {t('home.inputPreviewPlaceholder')}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── FeatureCard ──────────────────────────────────────────────────────────────

function FeatureCard({
  theme,
  iconName,
  title,
  description,
  children,
}: {
  theme: AppTheme;
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={[
        styles.featureCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.xl,
        },
      ]}
    >
      <View
        style={[
          styles.featureIconWrap,
          {
            backgroundColor: theme.colors.surfaceHigh,
            borderRadius: theme.radius.md,
          },
        ]}
      >
        <Ionicons
          name={iconName}
          size={moderateScale(20)}
          color={theme.colors.primary}
        />
      </View>
      <Text
        style={[
          styles.featureTitle,
          {
            color: theme.colors.textPrimary,
            fontFamily: theme.typography.fonts.bold,
            fontSize: theme.typography.sizes.xl,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.featureDesc,
          {
            color: theme.colors.textSecondary,
            fontFamily: theme.typography.fonts.regular,
            fontSize: theme.typography.sizes.sm,
          },
        ]}
      >
        {description}
      </Text>
      {children}
    </View>
  );
}

// ─── ToneChip ─────────────────────────────────────────────────────────────────

function ToneChip({
  label,
  active,
  theme,
}: {
  label: string;
  active: boolean;
  theme: AppTheme;
}) {
  if (active) {
    return (
      <LinearGradient
        colors={theme.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.chip, { borderRadius: theme.radius.pill }]}
      >
        <Text
          style={[
            styles.chipText,
            {
              color: "#FFFFFF",
              fontFamily: theme.typography.fonts.semiBold,
              fontSize: theme.typography.sizes.sm,
            },
          ]}
        >
          {label}
        </Text>
      </LinearGradient>
    );
  }

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: theme.colors.surfaceHigh,
          borderRadius: theme.radius.pill,
        },
      ]}
    >
      <Text
        style={[
          styles.chipText,
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
  );
}

// ─── DestinationIcon ──────────────────────────────────────────────────────────

function DestinationIcon({
  iconName,
  theme,
}: {
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  theme: AppTheme;
}) {
  return (
    <View
      style={[
        styles.destIcon,
        {
          backgroundColor: theme.colors.surfaceHigh,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      <Ionicons
        name={iconName}
        size={moderateScale(22)}
        color={theme.colors.primary}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    paddingTop: verticalScale(16),
    paddingHorizontal: scale(20),
  },

  // Hero
  hero: {
    alignItems: "flex-start",
    marginBottom: verticalScale(24),
  },
  badgePill: {
    borderWidth: 1,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(5),
    marginBottom: verticalScale(20),
  },
  badgeText: {
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headlineContainer: {
    marginBottom: verticalScale(16),
  },
  headlineLine: {
    lineHeight: moderateScale(44),
  },
  headlineAccent: {
    lineHeight: moderateScale(44),
  },
  subtitle: {
    lineHeight: moderateScale(22),
    marginBottom: verticalScale(24),
  },
  ctaRow: {
    gap: verticalScale(12),
  },
  ctaPrimary: {
    alignSelf: "flex-start",
  },
  ctaPrimaryGradient: {
    paddingHorizontal: scale(28),
    paddingVertical: verticalScale(14),
  },
  ctaPrimaryText: {},
  ctaSecondary: {
    borderWidth: 1,
    paddingHorizontal: scale(28),
    paddingVertical: verticalScale(14),
    alignSelf: "flex-start",
  },
  ctaSecondaryText: {},

  // Feature cards
  featureCard: {
    borderWidth: 1,
    padding: scale(20),
    marginBottom: verticalScale(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: moderateScale(2) },
    shadowOpacity: 0.04,
    shadowRadius: moderateScale(8),
    elevation: 2,
  },
  featureIconWrap: {
    width: moderateScale(40),
    height: moderateScale(40),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(12),
  },
  featureTitle: {
    marginBottom: verticalScale(8),
  },
  featureDesc: {
    lineHeight: moderateScale(20),
    marginBottom: verticalScale(16),
  },

  // Tone chips
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(8),
  },
  chip: {
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(7),
  },
  chipText: {},

  // Destination icons
  destIconsRow: {
    flexDirection: "row",
    gap: scale(12),
  },
  destIcon: {
    width: moderateScale(52),
    height: moderateScale(52),
    alignItems: "center",
    justifyContent: "center",
  },

  // Testimonial
  testimonialCard: {
    backgroundColor: "#191C1D",
    padding: scale(24),
    marginBottom: verticalScale(16),
  },
  testimonialTitle: {
    marginBottom: verticalScale(16),
    lineHeight: moderateScale(32),
  },
  testimonialQuote: {
    lineHeight: moderateScale(26),
    marginBottom: verticalScale(20),
  },
  testimonialAuthorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  testimonialAvatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    alignItems: "center",
    justifyContent: "center",
  },
  testimonialAvatarText: {},
  testimonialName: {
    marginBottom: verticalScale(2),
  },
  testimonialRole: {},

  // Bottom CTA
  bottomCta: {
    alignItems: "center",
    paddingTop: verticalScale(8),
  },
  bottomCtaTitle: {
    textAlign: "center",
    lineHeight: moderateScale(34),
    marginBottom: verticalScale(10),
  },
  aiPulseBadge: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    marginBottom: verticalScale(20),
  },
  aiPulseText: {
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  inputPreview: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
    borderWidth: 1,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
  },
  inputPreviewText: {},
});
