import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTheme } from '@/hooks/useTheme';

export default function ShapeScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text
            style={[
              styles.headerTitle,
              { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold, fontSize: theme.typography.sizes.xl },
            ]}
          >
            Shape
          </Text>
          <Text
            style={[
              styles.headerSub,
              { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.regular, fontSize: theme.typography.sizes.sm },
            ]}
          >
            Transform your words with AI
          </Text>
        </View>

        {/* Placeholder */}
        <View style={styles.placeholderWrapper}>
          <LinearGradient
            colors={theme.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.iconCircle, { borderRadius: moderateScale(32) }]}
          >
            <Ionicons name="sparkles" size={moderateScale(32)} color="#FFFFFF" />
          </LinearGradient>
          <Text
            style={[
              styles.placeholderTitle,
              { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.semiBold, fontSize: theme.typography.sizes.lg },
            ]}
          >
            Coming Soon
          </Text>
          <Text
            style={[
              styles.placeholderSub,
              { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.regular, fontSize: theme.typography.sizes.sm },
            ]}
          >
            The AI transform screen is being built.
          </Text>
        </View>

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
  header: {
    marginBottom: verticalScale(24),
    gap: verticalScale(4),
  },
  headerTitle: {},
  headerSub: {},
  placeholderWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: verticalScale(16),
    paddingBottom: verticalScale(80),
  },
  iconCircle: {
    width: moderateScale(72),
    height: moderateScale(72),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(8),
  },
  placeholderTitle: {
    textAlign: 'center',
  },
  placeholderSub: {
    textAlign: 'center',
  },
});
