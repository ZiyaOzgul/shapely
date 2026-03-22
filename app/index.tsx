import { useColorScheme, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { useTheme } from "@/hooks/useTheme";

const bgLight = require("@/assets/shapely/splashLight.png");
const bgDark = require("@/assets/shapely/splashDark.png");

export default function WelcomeScreen() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const bg = colorScheme === "dark" ? bgDark : bgLight;

  return (
    <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>

          {/* Logo placeholder */}
          <View style={[styles.logoOuter, { borderColor: theme.colors.border }]}>
            <View style={[styles.logoInner, { backgroundColor: theme.colors.surfaceHigh }]} />
          </View>

          {/* Text */}
          <View style={styles.textSection}>
            <Text
              style={[
                styles.title,
                { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold },
              ]}
            >
              Shapely
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
              Transform your words into platform‑ready content, powered by AI.
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
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
                    { fontFamily: theme.typography.fonts.semiBold, fontSize: moderateScale(16) },
                  ]}
                >
                  Get Started →
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
                Register
              </Text>
            </TouchableOpacity>
          </View>

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
  logoOuter: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(40),
  },
  logoInner: {
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(13),
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
