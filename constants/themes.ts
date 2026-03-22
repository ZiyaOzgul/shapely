import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import {
  ColorScheme,
  DarkColors,
  Gradients,
  LightColors,
  Radius,
  Spacing,
} from "./colors";
import { Typography } from "./typhography";

const buildTheme = (colors: ColorScheme) => ({
  colors,
  gradients: Gradients,
  spacing: {
    xs: scale(Spacing.xs),
    sm: scale(Spacing.sm),
    md: scale(Spacing.md),
    lg: scale(Spacing.lg),
    xl: scale(Spacing.xl),
  },
  radius: {
    sm: moderateScale(Radius.sm),
    md: moderateScale(Radius.md),
    lg: moderateScale(Radius.lg),
    xl: moderateScale(Radius.xl),
    pill: moderateScale(Radius.pill),
  },
  typography: {
    ...Typography,
    sizes: {
      xs: moderateScale(Typography.sizes.xs),
      sm: moderateScale(Typography.sizes.sm),
      md: moderateScale(Typography.sizes.md),
      lg: moderateScale(Typography.sizes.lg),
      xl: moderateScale(Typography.sizes.xl),
      xxl: moderateScale(Typography.sizes.xxl),
      display: moderateScale(Typography.sizes.display),
    },
  },
  // Interactive states
  interaction: {
    pressScale: 0.95,
    blurIntensity: {
      light: 10,
      dark: 20,
    },
  },
});

export const LightTheme = buildTheme(LightColors);
export const DarkTheme = buildTheme(DarkColors);

export type AppTheme = typeof LightTheme;

export { moderateScale, scale, verticalScale };

