import {StyleSheet} from "react-native";


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
    tabBar:'#54beff',
    tabBarInactiveTintColor: '#B8E6FF',
    buttonColor: '#6366F1',
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



export const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
    paddingHorizontal: tokens.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  basicContainer: {
    flex: 1,
    backgroundColor: tokens.colors.cardBackground,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
})

export const sharedFonts = StyleSheet.create({
  errorText: {
    color: '#EF4444',
    fontSize: 16,
  },
  headerText: {
    fontSize: 32,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  bigText: {
    fontSize: 22,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  mediumText:{
    fontSize: 16,
    color: tokens.colors.text,
    fontWeight: '600',
  },
  smallText: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  mediumSubtleText:{
    fontSize: 16,
    color: tokens.colors.textSubtle,
    fontWeight: '500',
  },
  smallSubtleText:{
    fontSize: 14,
    color: tokens.colors.textSubtle,
  },
  upperCaseSubtleText:{
    fontSize: 16,
    color: tokens.colors.textSubtle,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mediumWhiteText:{
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  smallWhiteText:{
    fontSize: 14,
    color: 'white',
  },

  bigEmoji: {
    fontSize: 64,
  },
  biggerEmoji: {
    fontSize: 48,
  },
  mediumEmoji: {
    fontSize: 24,
  },
  smallEmoji: {fontSize: 20},

})

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

// Do not question this, I
// was just really excited to work on something other
// than Auth T___T
export const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
    paddingHorizontal: tokens.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: tokens.spacing.md as unknown as number,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: tokens.colors.textSubtle,
    marginBottom: tokens.spacing.lg,
    textAlign: 'center',
    maxWidth: 520,
  },
  button: {
    backgroundColor: tokens.colors.text,
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.xl,
    borderRadius: tokens.radius.md,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  smallNote: {
    marginTop: tokens.spacing.md,
    color: tokens.colors.textSubtle,
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 420,
  },
});



export const oneHabitStyles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 10,
  },

  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10
  },
  dayButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 50,
    alignItems: 'center',
  },
  dayButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  dayTextActive: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: tokens.colors.buttonColor,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
});


export const searchHabitStyles = StyleSheet.create({
  flex: {flex: 1},
  container: {padding: 16, alignItems: 'center'},
  inputCard: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  input: {
    fontSize: 16,
    padding: 8,
    flex: 1,
  },
  sectionHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  suggestionsWrap: {
    width: '100%',
    display: 'flex',
    gap: 8,
  },
  suggestion: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 8,
  },
  suggestionRow: {flexDirection: 'row', alignItems: 'center'},
});



export const progressCard = StyleSheet.create({
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressPercent: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B82F6',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
});

export const progressCardStyles = StyleSheet.create({
  container: {
    marginBottom: 12,
    position: 'relative',
  },
  actionBg: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    borderRadius: 16,
  },
  actionBgComplete: {
    backgroundColor: '#10B981',
    justifyContent: 'flex-start',
    paddingLeft: 24,
  },
  actionBgUndo: {
    backgroundColor: '#EF4444',
    justifyContent: 'flex-end',
    paddingRight: 24,
  },
  habitCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  habitContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export const homeScreenStyles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: 'white',
  },
})