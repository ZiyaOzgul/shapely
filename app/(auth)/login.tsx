import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useTheme } from '@/hooks/useTheme';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from '@react-native-firebase/auth';

const appIcon = require('@/assets/images/icon.png');

export default function LoginScreen() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const passwordRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log('[Login] Attempting sign-in for:', email.trim());
      await signInWithEmailAndPassword(auth, email.trim(), password);
      console.log('[Login] Sign-in successful');
      router.replace('/(tabs)');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      console.error('[Login] Error code:', code, '| Full error:', err);
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top bar */}
          <View style={styles.topBar}>
            <Ionicons name="sparkles" size={moderateScale(18)} color={theme.colors.primary} />
            <Text
              style={[
                styles.brandText,
                { color: theme.colors.primary, fontFamily: theme.typography.fonts.bold, fontSize: theme.typography.sizes.lg },
              ]}
            >
              Shapely
            </Text>
          </View>

          {/* Logo card */}
          <View
            style={[
              styles.logoCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.xl,
              },
            ]}
          >
            <Image source={appIcon} style={styles.logoImage} resizeMode="cover" />
          </View>

          {/* Heading */}
          <View style={styles.headingBlock}>
            <Text
              style={[
                styles.title,
                { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold, fontSize: theme.typography.sizes.xxl },
              ]}
            >
              Login
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium, fontSize: theme.typography.sizes.sm },
              ]}
            >
              Welcome back to your curated workspace
            </Text>
          </View>

          {/* Form card */}
          <View
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
                { backgroundColor: theme.colors.background, borderColor: theme.colors.border, borderRadius: theme.radius.md },
              ]}
            >
              <Ionicons name="mail-outline" size={moderateScale(18)} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input,
                  { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.regular, fontSize: theme.typography.sizes.md },
                ]}
                placeholder="Email Address"
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
                { backgroundColor: theme.colors.background, borderColor: theme.colors.border, borderRadius: theme.radius.md },
              ]}
            >
              <Ionicons name="lock-closed-outline" size={moderateScale(18)} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                ref={passwordRef}
                style={[
                  styles.input,
                  { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.regular, fontSize: theme.typography.sizes.md },
                ]}
                placeholder="Password"
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
              onPress={() => router.push('/(auth)/forgot-password')}
            >
              <Text
                style={[
                  styles.forgotText,
                  { color: theme.colors.primary, fontFamily: theme.typography.fonts.medium, fontSize: theme.typography.sizes.sm },
                ]}
              >
                Forgot password?
              </Text>
            </TouchableOpacity>

            {/* Error message */}
            {error && (
              <Text
                style={[
                  styles.errorText,
                  { color: theme.colors.error, fontFamily: theme.typography.fonts.regular, fontSize: theme.typography.sizes.xs },
                ]}
              >
                {error}
              </Text>
            )}
          </View>

          {/* Login button */}
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
                    { fontFamily: theme.typography.fonts.semiBold, fontSize: theme.typography.sizes.md },
                  ]}
                >
                  Login →
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Social divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
            <Text
              style={[
                styles.dividerText,
                { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium, fontSize: theme.typography.sizes.xs },
              ]}
            >
              OR CONTINUE WITH
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
          </View>

          {/* Social buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.socialButton, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface, borderRadius: theme.radius.pill }]}
              onPress={() => { /* TODO: Google sign-in */ }}
            >
              <AntDesign name="google" size={moderateScale(18)} color={theme.colors.textPrimary} />
              <Text
                style={[
                  styles.socialButtonText,
                  { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.medium, fontSize: theme.typography.sizes.sm },
                ]}
              >
                Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.socialButton, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface, borderRadius: theme.radius.pill }]}
              onPress={() => { /* TODO: Apple sign-in */ }}
            >
              <AntDesign name="apple1" size={moderateScale(18)} color={theme.colors.textPrimary} />
              <Text
                style={[
                  styles.socialButtonText,
                  { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.medium, fontSize: theme.typography.sizes.sm },
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
                { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.regular, fontSize: theme.typography.sizes.sm },
              ]}
            >
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/(auth)/register')}>
              <Text
                style={[
                  styles.footerLink,
                  { color: theme.colors.primary, fontFamily: theme.typography.fonts.semiBold, fontSize: theme.typography.sizes.sm },
                ]}
              >
                Sign Up
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    marginBottom: verticalScale(32),
  },
  brandText: {},
  logoCard: {
    alignSelf: 'center',
    width: moderateScale(80),
    height: moderateScale(80),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: moderateScale(4) },
    shadowOpacity: 0.08,
    shadowRadius: moderateScale(12),
    elevation: 4,
  },
  logoImage: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(14),
  },
  headingBlock: {
    alignItems: 'center',
    marginTop: verticalScale(24),
    marginBottom: verticalScale(24),
    gap: verticalScale(6),
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  formCard: {
    borderWidth: 1,
    padding: scale(20),
    gap: verticalScale(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: moderateScale(4) },
    shadowOpacity: 0.06,
    shadowRadius: moderateScale(12),
    elevation: 3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
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
    alignSelf: 'flex-end',
  },
  forgotText: {},
  errorText: {
    textAlign: 'center',
  },
  loginButtonOuter: {
    width: '100%',
    marginTop: verticalScale(16),
  },
  loginButton: {
    height: verticalScale(52),
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(20),
    gap: scale(10),
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  socialRow: {
    flexDirection: 'row',
    gap: scale(12),
  },
  socialButton: {
    flex: 1,
    height: verticalScale(48),
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
  },
  socialButtonText: {},
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(24),
  },
  footerText: {},
  footerLink: {},
});
