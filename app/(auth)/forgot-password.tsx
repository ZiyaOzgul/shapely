import { useTheme } from "@/hooks/useTheme";
import { auth } from "@/lib/firebase";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { sendPasswordResetEmail } from "@react-native-firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import {
  ActivityIndicator,
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

export default function ForgotPasswordScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) {
      setError(t('errors.enterEmail'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSent(true);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/user-not-found") {
        setError(t('errors.noAccountFound'));
      } else if (code === "auth/invalid-email") {
        setError(t('errors.invalidEmail'));
      } else {
        setError(t('errors.somethingWentWrong'));
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
          {/* Top bar */}
          <Animated.View entering={FadeIn.duration(300)} style={styles.topBar}>
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
            <Text
              style={[
                styles.topBarTitle,
                {
                  color: theme.colors.primary,
                  fontFamily: theme.typography.fonts.bold,
                  fontSize: theme.typography.sizes.lg,
                },
              ]}
            >
              {t('common.appName')}
            </Text>
            {/* Spacer to center title */}
            <View style={styles.backButton} />
          </Animated.View>

          {/* Icon */}
          <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.iconContainer}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Ionicons
                name="mail"
                size={moderateScale(40)}
                color={theme.colors.primary}
              />
            </View>
          </Animated.View>

          {/* Heading */}
          <Animated.View entering={FadeInDown.duration(400).delay(180)} style={styles.headingBlock}>
            <Text
              style={[
                styles.title,
                {
                  color: theme.colors.textPrimary,
                  fontFamily: theme.typography.fonts.bold,
                  fontSize: moderateScale(28),
                },
              ]}
            >
              {sent ? t('auth.forgotPassword.successTitle') : t('auth.forgotPassword.title')}
            </Text>
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
              {sent
                ? t('auth.forgotPassword.successSubtitle', { email: email.trim() })
                : t('auth.forgotPassword.subtitle')}
            </Text>
          </Animated.View>

          {/* Form — hidden after success */}
          {!sent && (
            <Animated.View entering={FadeInDown.duration(400).delay(260)} style={styles.formSection}>
              <Text
                style={[
                  styles.label,
                  {
                    color: theme.colors.textPrimary,
                    fontFamily: theme.typography.fonts.medium,
                    fontSize: theme.typography.sizes.sm,
                  },
                ]}
              >
                {t('auth.forgotPassword.emailLabel')}
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
                <Ionicons
                  name="at"
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
                  placeholder={t('auth.forgotPassword.emailPlaceholder')}
                  placeholderTextColor={theme.colors.textDisabled}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="send"
                  underlineColorAndroid="transparent"
                  onSubmitEditing={handleSend}
                />
              </View>

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

              {/* Send button */}
              <TouchableOpacity
                activeOpacity={0.95}
                disabled={loading}
                onPress={handleSend}
                style={styles.sendButtonOuter}
              >
                <LinearGradient
                  colors={theme.gradients.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.sendButton,
                    { borderRadius: theme.radius.pill },
                  ]}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text
                      style={[
                        styles.sendButtonText,
                        {
                          fontFamily: theme.typography.fonts.semiBold,
                          fontSize: theme.typography.sizes.md,
                        },
                      ]}
                    >
                      {t('auth.forgotPassword.button')}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Return to Login */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.returnLink}
            onPress={() => router.back()}
          >
            <Text
              style={[
                styles.returnText,
                {
                  color: theme.colors.primary,
                  fontFamily: theme.typography.fonts.medium,
                  fontSize: theme.typography.sizes.sm,
                },
              ]}
            >
              {t('auth.forgotPassword.returnToLogin')}
            </Text>
          </TouchableOpacity>
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
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(32),
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(40),
  },
  backButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: {
    textAlign: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: verticalScale(28),
  },
  iconCircle: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: moderateScale(4) },
    shadowOpacity: 0.08,
    shadowRadius: moderateScale(12),
    elevation: 4,
  },
  headingBlock: {
    alignItems: "center",
    marginBottom: verticalScale(32),
    gap: verticalScale(8),
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    maxWidth: scale(280),
    lineHeight: moderateScale(14) * 1.6,
  },
  formSection: {
    gap: verticalScale(10),
    marginBottom: verticalScale(8),
  },
  label: {},
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
  errorText: {
    textAlign: "center",
  },
  sendButtonOuter: {
    width: "100%",
    marginTop: verticalScale(8),
  },
  sendButton: {
    height: verticalScale(52),
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    color: "#FFFFFF",
  },
  returnLink: {
    alignItems: "center",
    marginTop: verticalScale(28),
  },
  returnText: {},
});
