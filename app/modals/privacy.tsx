import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const logoShapely = require("@/assets/shapely/logoShapely.png");

export default function PrivacyScreen() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={moderateScale(22)}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>

        {/* Hero */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(80)}
          style={styles.hero}
        >
          <Text
            style={[
              styles.heroTitle,
              {
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fonts.bold,
                fontSize: moderateScale(36),
              },
            ]}
          >
            {t("privacy.title")}
          </Text>

          <Text
            style={[
              styles.heroSubtitle,
              {
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fonts.regular,
                fontSize: theme.typography.sizes.md,
                lineHeight: moderateScale(15) * 1.6,
              },
            ]}
          >
            {t("privacy.subtitle")}
          </Text>

          <Text
            style={[
              styles.lastUpdated,
              {
                color: theme.colors.primary,
                fontFamily: theme.typography.fonts.semiBold,
                fontSize: theme.typography.sizes.sm,
              },
            ]}
          >
            {t("privacy.lastUpdated")}
          </Text>
        </Animated.View>

        {/* Data Collection */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(160)}
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.xl,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: "rgba(88,101,242,0.12)" },
              ]}
            >
              <Ionicons
                name="server-outline"
                size={moderateScale(20)}
                color={theme.colors.primary}
              />
            </View>
            <Text
              style={[
                styles.cardTitle,
                {
                  color: theme.colors.textPrimary,
                  fontFamily: theme.typography.fonts.bold,
                  fontSize: theme.typography.sizes.lg,
                },
              ]}
            >
              {t("privacy.dataCollection.title")}
            </Text>
          </View>

          <Text
            style={[
              styles.cardBody,
              {
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fonts.regular,
                fontSize: theme.typography.sizes.sm,
                lineHeight: moderateScale(13) * 1.7,
              },
            ]}
          >
            {t("privacy.dataCollection.description")}
          </Text>

          {[
            t("privacy.dataCollection.items.account"),
            t("privacy.dataCollection.items.usage"),
            t("privacy.dataCollection.items.ip"),
            t("privacy.dataCollection.items.feedback"),
          ].map((item) => (
            <CheckRow key={item} label={item} theme={theme} />
          ))}
        </Animated.View>

        {/* AI Usage */}
        <Animated.View entering={FadeInDown.duration(400).delay(240)}>
          <LinearGradient
            colors={theme.gradients.primary as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, { borderRadius: theme.radius.xl }]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.iconCircleWhite}>
                <Ionicons
                  name="sparkles"
                  size={moderateScale(20)}
                  color="#FFF"
                />
              </View>
              <Text
                style={[
                  styles.cardTitle,
                  {
                    color: "#FFF",
                    fontFamily: theme.typography.fonts.bold,
                    fontSize: theme.typography.sizes.lg,
                  },
                ]}
              >
                {t("privacy.aiUsage.title")}
              </Text>
            </View>

            <Text
              style={[
                styles.cardBody,
                {
                  color: "rgba(255,255,255,0.85)",
                  fontFamily: theme.typography.fonts.regular,
                  fontSize: theme.typography.sizes.sm,
                  lineHeight: moderateScale(13) * 1.7,
                },
              ]}
            >
              {t("privacy.aiUsage.description")}
            </Text>

            <View style={styles.pill}>
              <View style={styles.pillDot} />
              <Text
                style={[
                  styles.pillText,
                  {
                    fontFamily: theme.typography.fonts.semiBold,
                  },
                ]}
              >
                {t("privacy.aiUsage.badge")}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Security */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(320)}
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.xl,
            },
          ]}
        >
          <Text style={styles.cardTitle}>{t("privacy.security.title")}</Text>

          <Text style={styles.cardBody}>
            {t("privacy.security.description")}
          </Text>

          <View style={styles.badgeRow}>
            {[
              t("privacy.security.badges.aes"),
              t("privacy.security.badges.tls"),
              t("privacy.security.badges.soc"),
            ].map((badge) => (
              <View key={badge} style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Third Party */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(400)}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>{t("privacy.thirdParty.title")}</Text>

          <Text style={styles.cardBody}>
            {t("privacy.thirdParty.description")}
          </Text>

          {[
            {
              label: t("privacy.thirdParty.integrations.boss"),
              icon: "briefcase-outline",
            },
            {
              label: t("privacy.thirdParty.integrations.slack"),
              icon: "chatbubbles-outline",
            },
          ].map(({ label, icon }) => (
            <IntegrationRow
              key={label}
              label={label}
              icon={icon as any}
              theme={theme}
            />
          ))}
        </Animated.View>

        {/* CTA */}
        <Animated.View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>{t("privacy.cta.title")}</Text>

          <Text style={styles.ctaSubtitle}>{t("privacy.cta.description")}</Text>

          <TouchableOpacity style={styles.ctaBtn}>
            <Text style={styles.ctaBtnText}>{t("privacy.cta.contact")}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.pdfBtn}>
            <Text style={styles.pdfBtnText}>{t("privacy.cta.pdf")}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer */}
        <Animated.View style={styles.footer}>
          <Text style={styles.footerCopy}>{t("privacy.footer.copyright")}</Text>

          {[
            t("privacy.footer.links.terms"),
            t("privacy.footer.links.cookies"),
            t("privacy.footer.links.security"),
          ].map((link) => (
            <Text key={link} style={styles.footerLink}>
              {link}
            </Text>
          ))}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CheckRow({
  label,
  theme,
}: {
  label: string;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View
      style={[
        styles.checkRow,
        {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
        },
      ]}
    >
      <Ionicons
        name="checkmark-circle"
        size={moderateScale(18)}
        color={theme.colors.success}
      />
      <Text
        style={[
          styles.checkLabel,
          {
            color: theme.colors.textPrimary,
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

function IntegrationRow({
  label,
  icon,
  theme,
}: {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View
      style={[
        styles.integrationRow,
        {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
        },
      ]}
    >
      <View
        style={[
          styles.integrationIcon,
          {
            backgroundColor: "rgba(88,101,242,0.12)",
            borderRadius: theme.radius.sm,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={moderateScale(16)}
          color={theme.colors.primary}
        />
      </View>
      <Text
        style={[
          styles.integrationLabel,
          {
            color: theme.colors.textPrimary,
            fontFamily: theme.typography.fonts.medium,
            fontSize: theme.typography.sizes.sm,
          },
        ]}
      >
        {label}
      </Text>
      <Ionicons
        name="open-outline"
        size={moderateScale(16)}
        color={theme.colors.textSecondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(120),
    gap: verticalScale(16),
  },
  backButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    alignItems: "center",
    justifyContent: "center",
  },
  // Hero
  hero: {
    alignItems: "center",
    gap: verticalScale(10),
    paddingVertical: verticalScale(8),
  },
  heroTitle: {
    textAlign: "center",
    lineHeight: moderateScale(36) * 1.1,
  },
  heroSubtitle: {
    textAlign: "center",
    maxWidth: scale(280),
  },
  lastUpdated: {
    textAlign: "center",
  },
  // Cards
  card: {
    borderWidth: 1,
    padding: scale(20),
    gap: verticalScale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: moderateScale(2) },
    shadowOpacity: 0.05,
    shadowRadius: moderateScale(8),
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  iconCircle: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(19),
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleWhite: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(19),
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {},
  cardBody: {},
  // Check rows
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(14),
    borderWidth: 1,
  },
  checkLabel: {},
  // Gradient card pill badge
  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: moderateScale(100),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(5),
    gap: scale(6),
  },
  pillDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: "#FFFFFF",
  },
  pillText: {
    color: "#FFFFFF",
    fontSize: moderateScale(10),
    letterSpacing: 0.8,
  },
  // Tech badges
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(8),
  },
  badge: {
    borderWidth: 1,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
  },
  badgeText: {
    letterSpacing: 0.4,
  },
  // Integration rows
  integrationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(14),
    borderWidth: 1,
  },
  integrationIcon: {
    width: moderateScale(32),
    height: moderateScale(32),
    alignItems: "center",
    justifyContent: "center",
  },
  integrationLabel: {
    flex: 1,
  },
  // CTA
  ctaSection: {
    alignItems: "center",
    gap: verticalScale(14),
    paddingVertical: verticalScale(8),
  },
  ctaTitle: {
    textAlign: "center",
    lineHeight: moderateScale(26) * 1.2,
  },
  ctaSubtitle: {
    textAlign: "center",
    maxWidth: scale(280),
  },
  ctaBtn: {
    width: "100%",
    shadowColor: "#5865F2",
    shadowOffset: { width: 0, height: moderateScale(4) },
    shadowOpacity: 0.35,
    shadowRadius: moderateScale(12),
    elevation: 4,
  },
  ctaBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(8),
    height: verticalScale(52),
  },
  ctaBtnText: {
    color: "#FFFFFF",
  },
  pdfBtn: {
    width: "100%",
    height: verticalScale(52),
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(8),
  },
  pdfBtnText: {},
  // Footer
  footer: {
    alignItems: "center",
    gap: verticalScale(8),
    paddingTop: verticalScale(8),
  },
  footerLogo: {
    width: scale(80),
    height: verticalScale(28),
    marginBottom: verticalScale(4),
  },
  footerCopy: {
    textAlign: "center",
  },
  footerLinks: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: scale(4),
  },
  footerLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
  },
  footerSep: {
    fontSize: moderateScale(10),
  },
  footerLink: {},
});
