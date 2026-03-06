import {ThemeColors} from '@/src/contexts/ThemeContext';
import {useThemedStyles} from '@/src/hooks/useThemedStyles';
import {radii, shadows, spacing} from '@/src/styles/screenStyles';

const createFriendsStyles = (colors: ThemeColors) => ({
  // ── Header ─────────────────────────────────
  header: {
    padding: spacing.xl,
    paddingTop: 60,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.subtleText,
    marginTop: 2,
  },
  copyIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingVertical: spacing.xs,
  },

  // ── Cards ───────────────────────────────────
  cardGroup: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: 0,
    ...shadows.subtle,
    overflow: 'hidden',
  },
  cardRow: {
    backgroundColor: colors.card,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.md,
    marginBottom: spacing.sm,
    ...shadows.subtle,
  },
  inviteRow: {
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  // ── Avatar ──────────────────────────────────
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.accent,
  },

  // ── Info ─────────────────────────────────────
  infoContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  subText: {
    fontSize: 13,
    color: colors.subtleText,
  },

  inviteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Chip ────────────────────────────────────
  coinBadge: {
    backgroundColor: colors.chipBackground,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.chipBorder,
  },
  coinText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.chipText,
  },

  // ── Invite input ─────────────────────────────
  inviteContainer: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  sendIconBtn: {
    padding: spacing.sm,
  },

  // ── Misc ─────────────────────────────────────
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
});

export function useFriendsStyles() {
  return useThemedStyles(createFriendsStyles);
}
