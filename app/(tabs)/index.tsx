import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTheme } from '@/hooks/useTheme';

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text
              style={[
                styles.greeting,
                { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.regular, fontSize: theme.typography.sizes.sm },
              ]}
            >
              Good morning 👋
            </Text>
            <Text
              style={[
                styles.headerTitle,
                { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold, fontSize: theme.typography.sizes.xl },
              ]}
            >
              Home
            </Text>
          </View>
        </View>

        {/* Placeholder card */}
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
            Home screen — content coming soon.
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(24),
  },
  headerText: {
    gap: verticalScale(2),
  },
  greeting: {},
  headerTitle: {},
  card: {
    borderWidth: 1,
    padding: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: verticalScale(120),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: moderateScale(2) },
    shadowOpacity: 0.05,
    shadowRadius: moderateScale(8),
    elevation: 2,
  },
  cardLabel: {},
});
