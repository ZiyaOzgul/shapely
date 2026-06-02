import { useTheme } from "@/hooks/useTheme";
import { auth, firestore } from "@/lib/firebase";
import { useTranslation } from "react-i18next";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "@react-native-firebase/auth";
import { doc, serverTimestamp, setDoc } from "@react-native-firebase/firestore";
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

type StrengthLevel = 0 | 1 | 2 | 3;

function getPasswordStrength(pwd: string): {
  level: StrengthLevel;
  label: string;
} {
  if (!pwd) return { level: 0, label: "" };
  const checks = [
    pwd.length >= 8,
    /[A-Z]/.test(pwd),
    /[0-9]/.test(pwd),
    /[^A-Za-z0-9]/.test(pwd),
  ];
  const score = checks.filter(Boolean).length;
  if (score <= 1) return { level: 1, label: "WEAK" };
  if (score === 2) return { level: 2, label: "MEDIUM" };
  return { level: 3, label: "STRONG" };
}

const STRENGTH_COLORS: Record<StrengthLevel, string> = {
  0: "transparent",
  1: "#EF4444",
  2: "#F59E0B",
  3: "#5865F2",
};

export default function RegisterScreen() {
  const theme = useTheme();
  const { t } = useTranslation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const strength = getPasswordStrength(password);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirm) {
      setError(t('errors.fillAllFields'));
      return;
    }
    if (password !== confirm) {
      setError(t('errors.passwordsDoNotMatch'));
      return;
    }
    if (password.length < 6) {
      setError(t('errors.passwordTooShort'));
      return;
    }
    if (!agreed) {
      setError(t('errors.agreeToTerms'));
      return;
    }

    setLoading(true);
    setError(null);
    console.log("[Register] Starting registration for:", email.trim());
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      console.log("[Register] User created, uid:", credential.user.uid);

      await updateProfile(credential.user, { displayName: fullName.trim() });
      console.log(
        "[Register] Profile updated with displayName:",
        fullName.trim(),
      );

      await setDoc(doc(firestore, "users", credential.user.uid), {
        displayName: fullName.trim(),
        email: email.trim().toLowerCase(),
        createdAt: serverTimestamp(),
      });
      console.log("[Register] Firestore user document written");

      router.replace("/(tabs)/index");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      console.error("[Register] Error code:", code, "| Full error:", err);
      if (code === "auth/email-already-in-use") {
        setError(t('errors.emailAlreadyExists'));
      } else if (code === "auth/invalid-email") {
        setError(t('errors.invalidEmail'));
      } else if (code === "auth/weak-password") {
        setError(t('errors.passwordTooWeak'));
      } else {
        setError(t('errors.registrationFailed'));
      }
    } finally {
      setLoading(false);
      console.log("[Register] Registration flow complete, loading cleared");
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
          {/* Top bar — centered */}
          <Animated.View entering={FadeIn.duration(300)} style={styles.topBar}>
            <Image source={appIcon} style={styles.topIcon} resizeMode="cover" />
            <Text
              style={[
                styles.brandText,
                {
                  color: theme.colors.primary,
                  fontFamily: theme.typography.fonts.bold,
                  fontSize: theme.typography.sizes.lg,
                },
              ]}
            >
              {t('common.appName')}
            </Text>
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
              {t('auth.register.title')}
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
              {t('auth.register.subtitle')}
            </Text>
          </Animated.View>

          {/* Full Name */}
          <Animated.View entering={FadeInDown.duration(400).delay(160)} style={styles.fieldGroup}>
            <Text
              style={[
                styles.fieldLabel,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fonts.semiBold,
                  fontSize: theme.typography.sizes.xs,
                },
              ]}
            >
              {t('auth.register.fullName')}
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.md,
                },
              ]}
            >
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.colors.textPrimary,
                    fontFamily: theme.typography.fonts.regular,
                    fontSize: theme.typography.sizes.md,
                  },
                ]}
                placeholder={t('auth.register.namePlaceholder')}
                placeholderTextColor={theme.colors.textDisabled}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                underlineColorAndroid="transparent"
                onSubmitEditing={() => emailRef.current?.focus()}
              />
            </View>
          </Animated.View>

          {/* Email Address */}
          <Animated.View entering={FadeInDown.duration(400).delay(220)} style={styles.fieldGroup}>
            <Text
              style={[
                styles.fieldLabel,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fonts.semiBold,
                  fontSize: theme.typography.sizes.xs,
                },
              ]}
            >
              {t('auth.register.emailAddress')}
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.md,
                },
              ]}
            >
              <TextInput
                ref={emailRef}
                style={[
                  styles.input,
                  {
                    color: theme.colors.textPrimary,
                    fontFamily: theme.typography.fonts.regular,
                    fontSize: theme.typography.sizes.md,
                  },
                ]}
                placeholder={t('auth.register.emailPlaceholder')}
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
          </Animated.View>

          {/* Password */}
          <Animated.View entering={FadeInDown.duration(400).delay(280)} style={styles.fieldGroup}>
            <Text
              style={[
                styles.fieldLabel,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fonts.semiBold,
                  fontSize: theme.typography.sizes.xs,
                },
              ]}
            >
              {t('auth.register.password')}
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.md,
                },
              ]}
            >
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
                placeholder="••••••••"
                placeholderTextColor={theme.colors.textDisabled}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="next"
                underlineColorAndroid="transparent"
                onSubmitEditing={() => confirmRef.current?.focus()}
              />
            </View>
          </Animated.View>

          {/* Confirm */}
          <Animated.View entering={FadeInDown.duration(400).delay(340)} style={styles.fieldGroup}>
            <Text
              style={[
                styles.fieldLabel,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fonts.semiBold,
                  fontSize: theme.typography.sizes.xs,
                },
              ]}
            >
              {t('auth.register.confirm')}
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.md,
                },
              ]}
            >
              <TextInput
                ref={confirmRef}
                style={[
                  styles.input,
                  {
                    color: theme.colors.textPrimary,
                    fontFamily: theme.typography.fonts.regular,
                    fontSize: theme.typography.sizes.md,
                  },
                ]}
                placeholder="••••••••"
                placeholderTextColor={theme.colors.textDisabled}
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry
                returnKeyType="done"
                underlineColorAndroid="transparent"
                onSubmitEditing={handleRegister}
              />
            </View>
          </Animated.View>

          {/* Password strength */}
          {password.length > 0 && (
            <View style={styles.strengthRow}>
              <Text
                style={[
                  styles.strengthLabel,
                  {
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.fonts.medium,
                    fontSize: theme.typography.sizes.xs,
                  },
                ]}
              >
                {t('auth.register.securityStrength')}
              </Text>
              <Text
                style={[
                  styles.strengthValue,
                  {
                    color:
                      STRENGTH_COLORS[strength.level] ??
                      theme.colors.textSecondary,
                    fontFamily: theme.typography.fonts.semiBold,
                    fontSize: theme.typography.sizes.xs,
                  },
                ]}
              >
                {strength.label}
              </Text>
            </View>
          )}
          {password.length > 0 && (
            <View
              style={[
                styles.strengthBarBg,
                {
                  backgroundColor: theme.colors.border,
                  borderRadius: theme.radius.pill,
                },
              ]}
            >
              <View
                style={[
                  styles.strengthBarFill,
                  {
                    width: `${(strength.level / 3) * 100}%` as `${number}%`,
                    backgroundColor: STRENGTH_COLORS[strength.level],
                    borderRadius: theme.radius.pill,
                  },
                ]}
              />
            </View>
          )}

          {/* Terms checkbox */}
          <Animated.View entering={FadeInDown.duration(400).delay(400)}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.termsRow}
            onPress={() => setAgreed((v) => !v)}
          >
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: agreed
                    ? theme.colors.primary
                    : theme.colors.border,
                  backgroundColor: agreed
                    ? theme.colors.primary
                    : "transparent",
                  borderRadius: moderateScale(4),
                },
              ]}
            >
              {agreed && (
                <Ionicons
                  name="checkmark"
                  size={moderateScale(12)}
                  color="#FFFFFF"
                />
              )}
            </View>
            <Text
              style={[
                styles.termsText,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fonts.regular,
                  fontSize: theme.typography.sizes.xs,
                },
              ]}
            >
              {t('auth.register.agreePrefix')}
              <Text
                style={{
                  color: theme.colors.primary,
                  textDecorationLine: "underline",
                }}
              >
                {t('auth.register.termsOfService')}
              </Text>
              {t('auth.register.and')}
              <Text
                style={{
                  color: theme.colors.primary,
                  textDecorationLine: "underline",
                }}
              >
                {t('auth.register.privacyPolicy')}
              </Text>
              .
            </Text>
          </TouchableOpacity>
          </Animated.View>

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

          {/* Create Account button */}
          <Animated.View entering={FadeInDown.duration(300).delay(460)}>
          <TouchableOpacity
            activeOpacity={0.95}
            disabled={loading}
            onPress={handleRegister}
            style={styles.registerButtonOuter}
          >
            <LinearGradient
              colors={theme.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.registerButton,
                { borderRadius: theme.radius.pill },
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text
                  style={[
                    styles.registerButtonText,
                    {
                      fontFamily: theme.typography.fonts.semiBold,
                      fontSize: theme.typography.sizes.md,
                    },
                  ]}
                >
                  {t('auth.register.button')}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
          </Animated.View>

          {/* Social connect */}
          <Animated.View entering={FadeInDown.duration(300).delay(520)} style={styles.dividerRow}>
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
              {t('auth.register.socialConnect')}
            </Text>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: theme.colors.border },
              ]}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(300).delay(560)} style={styles.socialRow}>
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
                /* TODO: Google sign-up */
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
                {t('auth.register.google')}
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
                /* TODO: Apple sign-up */
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
                {t('auth.register.apple')}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer */}
          <Animated.View entering={FadeInDown.duration(300).delay(600)} style={styles.footer}>
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
              {t('auth.register.alreadyHaveAccount')}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/(auth)/login")}
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
                {t('auth.register.login')}
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
    justifyContent: "center",
    gap: scale(8),
    marginBottom: verticalScale(24),
  },
  topIcon: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(6),
  },
  brandText: {},
  headingBlock: {
    alignItems: "center",
    marginBottom: verticalScale(28),
    gap: verticalScale(6),
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
  fieldGroup: {
    gap: verticalScale(6),
    marginBottom: verticalScale(12),
  },
  fieldLabel: {
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  inputWrapper: {
    borderWidth: 1,
    height: verticalScale(50),
    paddingHorizontal: scale(14),
    justifyContent: "center",
  },
  input: {
    flex: 1,
  },
  strengthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(6),
    marginTop: verticalScale(4),
  },
  strengthLabel: {
    letterSpacing: 0.8,
  },
  strengthValue: {
    letterSpacing: 0.8,
  },
  strengthBarBg: {
    height: verticalScale(4),
    width: "100%",
    marginBottom: verticalScale(16),
    overflow: "hidden",
  },
  strengthBarFill: {
    height: "100%",
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: scale(10),
    marginBottom: verticalScale(4),
  },
  checkbox: {
    width: moderateScale(18),
    height: moderateScale(18),
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(1),
    flexShrink: 0,
  },
  termsText: {
    flex: 1,
    lineHeight: moderateScale(13) * 1.6,
  },
  errorText: {
    textAlign: "center",
    marginTop: verticalScale(4),
    marginBottom: verticalScale(4),
  },
  registerButtonOuter: {
    width: "100%",
    marginTop: verticalScale(16),
  },
  registerButton: {
    height: verticalScale(52),
    alignItems: "center",
    justifyContent: "center",
  },
  registerButtonText: {
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
