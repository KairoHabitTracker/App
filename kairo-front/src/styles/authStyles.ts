import {ThemeColors} from '@/src/contexts/ThemeContext';
import {useThemedStyles} from '@/src/hooks/useThemedStyles';
import {radii, spacing} from '@/src/styles/screenStyles';

const createAuthStyles = (colors: ThemeColors) => ({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxxl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  subtleText: {
    fontSize: 14,
    color: colors.subtleText,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    marginVertical: 6,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  },
  primaryButton: {
    width: '100%',
    marginTop: spacing.lg,
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: spacing.md,
    color: colors.accent,
    fontSize: 14,
    fontWeight: '500',
  },
  error: {
    width: '100%',
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: colors.dangerBackground,
    color: colors.danger,
    textAlign: 'center',
  },
});

export function useAuthStyles() {
  return useThemedStyles(createAuthStyles);
}
