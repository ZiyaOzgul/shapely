import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTheme } from '@/hooks/useTheme';
import { auth } from '@/lib/firebase';
import { signOut } from '@react-native-firebase/auth';

export default function ProfileScreen() {
  const theme = useTheme();
  const user = auth.currentUser;

  const handleSignOut = async () => {
    try {
      console.log('[Profile] Signing out user:', user?.email);
      await signOut(auth);
      console.log('[Profile] Sign-out successful');
      router.replace('/');
    } catch (err) {
      console.error('[Profile] Sign-out error:', err);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.container}>

        {/* Header */}
        <Text
          style={[
            styles.headerTitle,
            { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold, fontSize: theme.typography.sizes.xl },
          ]}
        >
          Profile
        </Text>

        {/* Avatar + name */}
        <View style={styles.avatarSection}>
          <LinearGradient
            colors={theme.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.avatar, { borderRadius: moderateScale(40) }]}
          >
            <Text
              style={[
                styles.avatarInitial,
                { color: '#FFFFFF', fontFamily: theme.typography.fonts.bold, fontSize: theme.typography.sizes.xxl },
              ]}
            >
              {user?.displayName?.[0]?.toUpperCase() ?? '?'}
            </Text>
          </LinearGradient>
          <Text
            style={[
              styles.displayName,
              { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.semiBold, fontSize: theme.typography.sizes.lg },
            ]}
          >
            {user?.displayName ?? 'User'}
          </Text>
          <Text
            style={[
              styles.email,
              { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.regular, fontSize: theme.typography.sizes.sm },
            ]}
          >
            {user?.email ?? ''}
          </Text>
        </View>

        {/* Info card */}
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
          <Text
            style={[
              styles.cardLabel,
              { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium, fontSize: theme.typography.sizes.sm },
            ]}
          >
            Profile settings — coming soon.
          </Text>
        </View>

        {/* Sign out */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.signOutButton,
            {
              borderColor: theme.colors.error,
              borderRadius: theme.radius.md,
            },
          ]}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={moderateScale(18)} color={theme.colors.error} />
          <Text
            style={[
              styles.signOutText,
              { color: theme.colors.error, fontFamily: theme.typography.fonts.semiBold, fontSize: theme.typography.sizes.sm },
            ]}
          >
            Sign Out
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(16),
  },
  headerTitle: {
    marginBottom: verticalScale(24),
  },
  avatarSection: {
    alignItems: 'center',
    gap: verticalScale(8),
    marginBottom: verticalScale(32),
  },
  avatar: {
    width: moderateScale(80),
    height: moderateScale(80),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(4),
  },
  avatarInitial: {},
  displayName: {},
  email: {},
  card: {
    borderWidth: 1,
    padding: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: verticalScale(100),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: moderateScale(2) },
    shadowOpacity: 0.05,
    shadowRadius: moderateScale(8),
    elevation: 2,
    marginBottom: verticalScale(24),
  },
  cardLabel: {},
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    height: verticalScale(48),
    borderWidth: 1.5,
  },
  signOutText: {},
});
