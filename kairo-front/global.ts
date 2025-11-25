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
    backgroundColor: '#fff',
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
    marginRight: 16,
  },
  emoji: { fontSize: 40 },
  content: { flex: 1 },
  name: { //maybe we could set something for our custom fonts
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  categoryBadge: { // maybe a component if we will be reusing it
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
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
  sectionTitle: { //font
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 10,
  },
  label: { //font
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
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
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  dayTextActive: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});



export const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
    paddingHorizontal: tokens.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: tokens.spacing.md as unknown as number,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
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
})


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
  sectionHeader: {fontSize: 12, color: '#374151', fontWeight: '600'},
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
  emoji: {fontSize: 20, marginRight: 10},
  habitName: {fontSize: 16, color: '#111827'},
  emptyText: {color: '#6B7280', fontStyle: 'italic', padding: 12},
});

