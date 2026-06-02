import { useTheme } from "@/hooks/useTheme";
import { auth } from "@/lib/firebase";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useRef, useState } from "react";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const appIcon = require("@/assets/images/icon.png");
const logoShapely = require("@/assets/shapely/logoShapely.png");

export default function LoginScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const passwordRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError(t('errors.fillAllFields'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log("[Login] Attempting sign-in for:", email.trim());
      await signInWithEmailAndPassword(auth, email.trim(), password);
      console.log("[Login] Sign-in successful");
      router.replace("/(tabs)");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      console.error("[Login] Error code:", code, "| Full error:", err);
      if (
        code === "auth/user-not-found" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
        setError(t('errors.invalidCredentials'));
      } else if (code === "auth/invalid-email") {
        setError(t('errors.invalidEmail'));
      } else {
        setError(t('errors.loginFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo card */}
          <Animated.View
            entering={FadeIn.duration(300)}
            style={[
              styles.logoCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.xl,
              },
            ]}
          >
            <Image
              source={logoShapely}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </Animated.View>

          {/* Heading */}
          <Animated.View entering={FadeInDown.duration(400).delay(80)} style={styles.headingBlock}>
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
              {t('auth.login.title')}
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fonts.medium,
                  fontSize: theme.typography.sizes.sm,
                },
              ]}
            >
              {t('auth.login.subtitle')}
            </Text>
          </Animated.View>

          {/* Form card */}
          <Animated.View
            entering={FadeInDown.duration(450).delay(160)}
            style={[
              styles.formCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.xl,
              },
            ]}
          >
            {/* Email input */}
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.md,
                },
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={moderateScale(18)}
                color={theme.colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.colors.textPrimary,
                    fontFamily: theme.typography.fonts.regular,
                    fontSize: theme.typography.sizes.md,
                  },
                ]}
                placeholder={t('auth.login.emailPlaceholder')}
                placeholderTextColor={theme.colors.textDisabled}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                underlineColorAndroid="transparent"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
            </View>

            {/* Password input */}
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.md,
                },
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={moderateScale(18)}
                color={theme.colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                ref={passwordRef}
                style={[
                  styles.input,
                  {
                    color: theme.colors.textPrimary,
                    fontFamily: theme.typography.fonts.regular,
                    fontSize: theme.typography.sizes.md,
                  },
                ]}
                placeholder={t('auth.login.passwordPlaceholder')}
                placeholderTextColor={theme.colors.textDisabled}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="done"
                underlineColorAndroid="transparent"
                onSubmitEditing={handleLogin}
              />
            </View>

            {/* Forgot password */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.forgotLink}
              onPress={() => router.push("/(auth)/forgot-password")}
            >
              <Text
                style={[
                  styles.forgotText,
                  {
                    color: theme.colors.primary,
                    fontFamily: theme.typography.fonts.medium,
                    fontSize: theme.typography.sizes.sm,
                  },
                ]}
              >
                {t('auth.login.forgotPassword')}
              </Text>
            </TouchableOpacity>

            {/* Error message */}
            {error && (
              <Text
                style={[
                  styles.errorText,
                  {
                    color: theme.colors.error,
                    fontFamily: theme.typography.fonts.regular,
                    fontSize: theme.typography.sizes.xs,
                  },
                ]}
              >
                {error}
              </Text>
            )}
          </Animated.View>

          {/* Login button */}
          <Animated.View entering={FadeInDown.duration(300).delay(260)}>
          <TouchableOpacity
            activeOpacity={0.95}
            disabled={loading}
            onPress={handleLogin}
            style={styles.loginButtonOuter}
          >
            <LinearGradient
              colors={theme.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.loginButton, { borderRadius: theme.radius.pill }]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text
                  style={[
                    styles.loginButtonText,
                    {
                      fontFamily: theme.typography.fonts.semiBold,
                      fontSize: theme.typography.sizes.md,
                    },
                  ]}
                >
                  {t('auth.login.button')}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
          </Animated.View>

          {/* Social divider */}
          <Animated.View entering={FadeInDown.duration(300).delay(340)} style={styles.dividerRow}>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: theme.colors.border },
              ]}
            />
            <Text
              style={[
                styles.dividerText,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fonts.medium,
                  fontSize: theme.typography.sizes.xs,
                },
              ]}
            >
              {t('auth.login.orContinueWith')}
            </Text>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: theme.colors.border },
              ]}
            />
          </Animated.View>

          {/* Social buttons */}
          <Animated.View entering={FadeInDown.duration(300).delay(400)} style={styles.socialRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.socialButton,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.radius.pill,
                },
              ]}
              onPress={() => {
                /* TODO: Google sign-in */
              }}
            >
              <AntDesign
                name="google"
                size={moderateScale(18)}
                color={theme.colors.textPrimary}
              />
              <Text
                style={[
                  styles.socialButtonText,
                  {
                    color: theme.colors.textPrimary,
                    fontFamily: theme.typography.fonts.medium,
                    fontSize: theme.typography.sizes.sm,
                  },
                ]}
              >
                {t('auth.login.google')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.socialButton,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.radius.pill,
                },
              ]}
              onPress={() => {
                /* TODO: Apple sign-in */
              }}
            >
              <AntDesign
                name="apple"
                size={moderateScale(18)}
                color={theme.colors.textPrimary}
              />
              <Text
                style={[
                  styles.socialButtonText,
                  {
                    color: theme.colors.textPrimary,
                    fontFamily: theme.typography.fonts.medium,
                    fontSize: theme.typography.sizes.sm,
                  },
                ]}
              >
                {t('auth.login.apple')}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer */}
          <Animated.View entering={FadeInDown.duration(300).delay(460)} style={styles.footer}>
            <Text
              style={[
                styles.footerText,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fonts.regular,
                  fontSize: theme.typography.sizes.sm,
                },
              ]}
            >
              {t('auth.login.noAccount')}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/(auth)/register")}
            >
              <Text
                style={[
                  styles.footerLink,
                  {
                    color: theme.colors.primary,
                    fontFamily: theme.typography.fonts.semiBold,
                    fontSize: theme.typography.sizes.sm,
                  },
                ]}
              >
                {t('auth.login.signUp')}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  kav: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(32),
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    marginBottom: verticalScale(32),
  },
  brandText: {},
  brandLogoImage: {
    height: verticalScale(28),
    width: scale(110),
  },
  logoCard: {
    alignSelf: "center",
    width: moderateScale(180),
    height: moderateScale(180),
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: moderateScale(4) },
    shadowOpacity: 0.08,
    shadowRadius: moderateScale(12),
    elevation: 4,
  },
  logoImage: {
    width: moderateScale(260),
    height: moderateScale(260),
    borderRadius: moderateScale(14),
  },
  headingBlock: {
    alignItems: "center",
    marginTop: verticalScale(24),
    marginBottom: verticalScale(24),
    gap: verticalScale(6),
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
  formCard: {
    borderWidth: 1,
    padding: scale(20),
    gap: verticalScale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: moderateScale(4) },
    shadowOpacity: 0.06,
    shadowRadius: moderateScale(12),
    elevation: 3,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: verticalScale(50),
    borderWidth: 1,
    paddingHorizontal: scale(14),
  },
  inputIcon: {
    marginRight: scale(8),
  },
  input: {
    flex: 1,
  },
  forgotLink: {
    alignSelf: "flex-end",
  },
  forgotText: {},
  errorText: {
    textAlign: "center",
  },
  loginButtonOuter: {
    width: "100%",
    marginTop: verticalScale(16),
  },
  loginButton: {
    height: verticalScale(52),
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: verticalScale(20),
    gap: scale(10),
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  socialRow: {
    flexDirection: "row",
    gap: scale(12),
  },
  socialButton: {
    flex: 1,
    height: verticalScale(48),
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(8),
  },
  socialButtonText: {},
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(24),
  },
  footerText: {},
  footerLink: {},
});
