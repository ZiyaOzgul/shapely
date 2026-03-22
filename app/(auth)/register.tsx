import { useTheme } from "@/hooks/useTheme";
import { auth, firestore } from "@/lib/firebase";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "@react-native-firebase/auth";
import { doc, serverTimestamp, setDoc } from "@react-native-firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useRef, useState } from "react";
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
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
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
        setError("An account with this email already exists.");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (code === "auth/weak-password") {
        setError("Password is too weak. Use at least 6 characters.");
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Registration failed. Please try again.",
        );
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
          <View style={styles.topBar}>
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
              Shapely
            </Text>
          </View>

          {/* Heading */}
          <View style={styles.headingBlock}>
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
              Create Account
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
              Start your journey with our editorial workspace.
            </Text>
          </View>

          {/* Full Name */}
          <View style={styles.fieldGroup}>
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
              FULL NAME
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
                placeholder="Julien Vellum"
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
          </View>

          {/* Email Address */}
          <View style={styles.fieldGroup}>
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
              EMAIL ADDRESS
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
                placeholder="julien@shapely.io"
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
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
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
              PASSWORD
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
          </View>

          {/* Confirm */}
          <View style={styles.fieldGroup}>
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
              CONFIRM
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
          </View>

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
                SECURITY STRENGTH
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
              I agree to the{" "}
              <Text
                style={{
                  color: theme.colors.primary,
                  textDecorationLine: "underline",
                }}
              >
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text
                style={{
                  color: theme.colors.primary,
                  textDecorationLine: "underline",
                }}
              >
                Privacy Policy
              </Text>
              .
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

          {/* Create Account button */}
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
                  Create Account →
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Social connect */}
          <View style={styles.dividerRow}>
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
              SOCIAL CONNECT
            </Text>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: theme.colors.border },
              ]}
            />
          </View>

          <View style={styles.socialRow}>
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
                Google
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
                Apple
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
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
              Already have an account?{" "}
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
                Login
              </Text>
            </TouchableOpacity>
          </View>
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
