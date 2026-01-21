import {ThemeColors} from '@/src/contexts/ThemeContext';
import {useThemedStyles} from '@/src/hooks/useThemedStyles';

const createAuthStyles = (colors: ThemeColors) => ({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingVertical: 32,
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginVertical: 6,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  },
  primaryButton: {
    width: '100%',
    marginTop: 16,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: 12,
    color: colors.accent,
    fontSize: 14,
    fontWeight: '500',
  },
  error: {
    width: '100%',
    borderRadius: 12,
    padding: 12,
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
