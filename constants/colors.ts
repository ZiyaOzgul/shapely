export const LightColors = {
  // Backgrounds
  background: "#F8F9FA",
  surface: "#FFFFFF",
  glass: "rgba(255, 255, 255, 0.7)",

  // Borders & Shadows
  border: "rgba(25, 28, 29, 0.1)",
  borderStrong: "rgba(25, 28, 29, 0.2)",
  shadow: "0 12px 32px rgba(25, 28, 29, 0.04)",

  // Typography
  textPrimary: "#191C1D",
  textSecondary: "#434656",
  textDisabled: "rgba(25, 28, 29, 0.3)",

  // Brand
  primary: "#5865F2",
  secondary: "#571BC1",
  surfaceHigh: "rgba(88, 101, 242, 0.08)",

  // Status
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
} as const;

export const DarkColors = {
  // Backgrounds
  background: "#0B1326",
  surface: "#131B2E",
  glass: "rgba(255, 255, 255, 0.05)",

  // Borders & Shadows
  border: "rgba(255, 255, 255, 0.1)",
  borderStrong: "rgba(255, 255, 255, 0.2)",
  shadow: "0 40px 40px rgba(0, 0, 0, 0.2)",

  // Typography
  textPrimary: "#FFFFFF",
  textSecondary: "#A1A1AA",
  textDisabled: "rgba(255, 255, 255, 0.3)",

  // Brand
  primary: "#5865F2",
  secondary: "#571BC1",
  surfaceHigh: "rgba(255, 255, 255, 0.08)",

  // Status
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
} as const;

export type ColorScheme = {
  background: string;
  surface: string;
  glass: string;
  border: string;
  borderStrong: string;
  shadow: string;
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  primary: string;
  secondary: string;
  surfaceHigh: string;
  success: string;
  error: string;
  warning: string;
};
export const Gradients = {
  primary: ["#5865F2", "#571BC1"] as const,
  angle: 135,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 100,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;
