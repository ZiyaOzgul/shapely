import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useTheme } from '@/hooks/useTheme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<string, { active: IconName; inactive: IconName }> = {
  index: { active: 'home', inactive: 'home-outline' },
  shape: { active: 'sparkles', inactive: 'sparkles-outline' },
  profile: { active: 'person', inactive: 'person-outline' },
};

const TAB_LABELS: Record<string, string> = {
  index: 'Home',
  shape: 'Shape',
  profile: 'Profile',
};

export default function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom + verticalScale(8) }]}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.xl,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const icons = TAB_ICONS[route.name] ?? { active: 'ellipse', inactive: 'ellipse-outline' };
          const label = TAB_LABELS[route.name] ?? route.name;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.7}
              onPress={onPress}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={descriptors[route.key].options.tabBarAccessibilityLabel}
            >
              {isFocused ? (
                <LinearGradient
                  colors={theme.gradients.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.activeIconBg, { borderRadius: moderateScale(14) }]}
                >
                  <Ionicons name={icons.active} size={moderateScale(20)} color="#FFFFFF" />
                </LinearGradient>
              ) : (
                <View style={styles.inactiveIconBg}>
                  <Ionicons name={icons.inactive} size={moderateScale(20)} color={theme.colors.textSecondary} />
                </View>
              )}
              <Text
                style={[
                  styles.label,
                  {
                    color: isFocused ? theme.colors.primary : theme.colors.textSecondary,
                    fontFamily: isFocused ? theme.typography.fonts.semiBold : theme.typography.fonts.regular,
                    fontSize: theme.typography.sizes.xs,
                  },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(8),
  },
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: moderateScale(-2) },
    shadowOpacity: 0.08,
    shadowRadius: moderateScale(16),
    elevation: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: verticalScale(4),
  },
  activeIconBg: {
    width: moderateScale(44),
    height: moderateScale(36),
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveIconBg: {
    width: moderateScale(44),
    height: moderateScale(36),
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {},
});
