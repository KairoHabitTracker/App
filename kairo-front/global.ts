import { StyleSheet } from "react-native";


export const tokens = {
  colors: {
    background: "#f8f9fb",
    text: "#1f2937",
    textSubtle: "#6b7280",
    avatarBackground: "#dfe3ea",
    avatarText: "#556070",
    cardBackground: "#ffffff",
    cardShadow: "#000000",
    statText: "#111827",
  },
  radius: {
    md: 12,
    full: 9999,
  },
  spacing: {
    xs: 4,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    fontSize: 36,
    fontWeight: "700",
  },
  username:{
    fontSize: 22,
    fontWeight: "600",
  },
  statistics: {
    labelFontSize: 12,
    valueFontSize: 20,
    valueFontWeight: "700",
  }
} as const;

// Profile-specific styles (can be reused or extended elsewhere)
export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.xxl,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: tokens.spacing.xl,
  },
  avatar: {
    width: tokens.avatar.width,
    height: tokens.avatar.height,
    borderRadius: tokens.avatar.borderRadius,
    marginBottom: tokens.spacing.sm,
  },
  avatarPlaceholder: {
    backgroundColor: tokens.colors.avatarBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitials: {
    fontSize: tokens.avatar.fontSize,
    fontWeight: tokens.avatar.fontWeight,
    color: tokens.colors.avatarText,
  },
  username: {
    fontSize: tokens.username.fontSize,
    fontWeight: tokens.username.fontWeight,
    color: tokens.colors.text,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12 as unknown as number, // RN gap not on all versions; fallback via margins
  },
  statCard: {
    flex: 1,
    backgroundColor: tokens.colors.cardBackground,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    shadowColor: tokens.colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    marginRight: tokens.spacing.sm,
    marginBottom: tokens.spacing.lg,
  },
  statLabel: {
    fontSize: tokens.statistics.labelFontSize,
    color: tokens.colors.textSubtle,
    marginBottom: tokens.spacing.xs,
  },
  statValue: {
    fontSize: tokens.statistics.valueFontSize,
    fontWeight: tokens.statistics.valueFontWeight,
    color: tokens.colors.statText,
  },
  subtle: {
    color: tokens.colors.textSubtle,
  },
});
