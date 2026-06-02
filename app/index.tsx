import { useTheme } from "@/hooks/useTheme";
import { useThemeContext } from "@/contexts/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const logoShapely = require("@/assets/shapely/logoShapely.png");

const bgLight = require("@/assets/shapely/splashLight.png");
const bgDark = require("@/assets/shapely/splashDark.png");

export default function WelcomeScreen() {
  const theme = useTheme();
  const { isDark } = useThemeContext();
  const { t } = useTranslation();
  const bg = isDark ? bgDark : bgLight;

  return (
    <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          {/* Logo */}
          <Animated.View entering={FadeIn.duration(500)}>
            <Image
              source={logoShapely}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Text */}
          <Animated.View entering={FadeInDown.duration(400).delay(150)} style={styles.textSection}>
            <Text
              style={[
                styles.title,
                {
                  color: theme.colors.textPrimary,
                  fontFamily: theme.typography.fonts.bold,
                },
              ]}
            >
              {t('common.appName')}
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fonts.medium,
                  lineHeight: moderateScale(15) * 1.6,
                },
              ]}
            >
              {t('welcome.subtitle')}
            </Text>
          </Animated.View>

          {/* Buttons */}
          <Animated.View entering={FadeInDown.duration(400).delay(280)} style={styles.buttons}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/(auth)/login")}
            >
              <LinearGradient
                colors={theme.gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.btn, { borderRadius: moderateScale(14) }]}
              >
                <Text
                  style={[
                    styles.primaryBtnText,
                    {
                      fontFamily: theme.typography.fonts.semiBold,
                      fontSize: moderateScale(16),
                    },
                  ]}
                >
                  {t('welcome.getStarted')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.btn,
                styles.secondaryBtn,
                {
                  borderRadius: moderateScale(14),
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => router.push("/(auth)/register")}
            >
              <Text
                style={[
                  styles.secondaryBtnText,
                  {
                    color: theme.colors.textPrimary,
                    fontFamily: theme.typography.fonts.semiBold,
                    fontSize: moderateScale(16),
                  },
                ]}
              >
                {t('welcome.register')}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(32),
  },
  logoImage: {
    height: verticalScale(200),
    width: scale(260),
    marginBottom: verticalScale(0),
  },
  textSection: {
    alignItems: "center",
    marginBottom: verticalScale(48),
    gap: verticalScale(10),
  },
  title: {
    fontSize: moderateScale(36),
    textAlign: "center",
  },
  subtitle: {
    fontSize: moderateScale(15),
    textAlign: "center",
    maxWidth: scale(260),
  },
  buttons: {
    width: "100%",
    gap: verticalScale(12),
  },
  btn: {
    height: verticalScale(52),
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    color: "#FFFFFF",
  },
  secondaryBtn: {
    borderWidth: 1,
  },
  secondaryBtnText: {},
});
