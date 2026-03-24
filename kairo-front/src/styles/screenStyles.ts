/**
 * screenStyles.ts
 *
 * Centralne, theme-aware style dla wszystkich głównych ekranów aplikacji.
 * Używaj `useScreenStyles()` w ekranach i uzupełniaj ekran-specyficzne
 * style lokalnie tylko kiedy faktycznie jest taka potrzeba.
 */

import {StyleSheet} from 'react-native';
import {ThemeColors} from '@/src/contexts/ThemeContext';
import {useThemedStyles} from '@/src/hooks/useThemedStyles';

// ─────────────────────────────────────────────
// Tokeny typograficzne
// ─────────────────────────────────────────────
export const typography = {
  /** Duży tytuł ekranu (np. nagłówek taba) */
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  /** Tytuł w top-barze (np. iOS-style centered) */
  topBarTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  /** Podtytuł pod tytułem ekranu */
  subtitle: {
    fontSize: 16,
    marginTop: 2,
  },
  /** Nagłówek sekcji (uppercase, muted) */
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  /** Nazwa elementu listy */
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  /** Opis / drobny tekst elementu */
  itemSubtext: {
    fontSize: 13,
  },
  /** Duża cyfra statystyki */
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  /** Etykieta statystyki */
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
} as const;

// ─────────────────────────────────────────────
// Tokeny przestrzeni
// ─────────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// ─────────────────────────────────────────────
// Tokeny promieni
// ─────────────────────────────────────────────
export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

// ─────────────────────────────────────────────
// Tokeny cieni (standardowe, subtelne)
// ─────────────────────────────────────────────
export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
} as const;

// ─────────────────────────────────────────────
// Główna fabryka stylów
// ─────────────────────────────────────────────
const createScreenStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    // ── Kontenery ────────────────────────────
    /** Pełnoekranowy wrapper ekranu */
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    /** Środkowanie (spinner / empty state) */
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },

    // ── Nagłówek ekranu (card-style) ─────────
    /** Blok nagłówkowy z card tłem, padding + border */
    header: {
      padding: spacing.xl,
      paddingTop: 60,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      ...typography.screenTitle,
      color: colors.text,
    },
    headerSubtitle: {
      ...typography.subtitle,
      color: colors.subtleText,
    },
    /** Topbar – mały, wycentrowany (Profile-style) */
    topBar: {
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    topBarTitle: {
      ...typography.topBarTitle,
      color: colors.text,
    },
    /** Nagłówek horyzontalny z row (Home-style: tytuł + badge po prawej) */
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.xxl,
      paddingHorizontal: spacing.xl,
    },

    // ── Scroll / treść listy ─────────────────
    scrollContent: {
      padding: spacing.lg,
      paddingBottom: 100,
    },

    // ── Sekcje ───────────────────────────────
    sectionContainer: {
      marginBottom: spacing.sm,
    },
    sectionTitle: {
      ...typography.sectionTitle,
      color: colors.subtleText,
      marginLeft: spacing.xs,
    },
    /** Sekcja z paddingiem (Settings-style) */
    sectionTitlePadded: {
      ...typography.sectionTitle,
      color: colors.subtleText,
      paddingHorizontal: spacing.xxl,
      marginBottom: spacing.sm,
    },

    // ── Karty ────────────────────────────────
    card: {
      backgroundColor: colors.card,
      borderRadius: radii.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      ...shadows.card,
    },
    cardGroup: {
      backgroundColor: colors.card,
      borderRadius: radii.lg,
      overflow: 'hidden',
      marginBottom: spacing.xxl,
      ...shadows.subtle,
    },
    /** Karta z paddingiem horizontal i pionowym – wewnątrz ScrollView */
    cardHorizontalMargin: {
      backgroundColor: colors.card,
      borderRadius: radii.lg,
      marginHorizontal: spacing.xl,
      marginBottom: spacing.xxl,
      ...shadows.card,
    },

    // ── Wiersze ───────────────────────────────
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: spacing.lg,
      borderRadius: radii.md,
      marginBottom: spacing.sm,
      ...shadows.subtle,
    },

    // ── Elementy listy ────────────────────────
    itemTitle: {
      ...typography.itemTitle,
      color: colors.text,
    },
    itemSubtext: {
      ...typography.itemSubtext,
      color: colors.subtleText,
    },

    // ── Statystyki ───────────────────────────
    statsRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginBottom: spacing.xxl,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: radii.lg,
      padding: spacing.lg,
      alignItems: 'center',
      ...shadows.card,
    },
    statValue: {
      ...typography.statValue,
      color: colors.text,
      marginBottom: spacing.xs,
      textAlign: 'center',
    },
    statLabel: {
      ...typography.statLabel,
      color: colors.subtleText,
      textTransform: 'uppercase',
    },

    // ── Divider ──────────────────────────────
    divider: {
      height: 1,
      backgroundColor: colors.border,
    },
    dividerIndented: {
      height: 1,
      backgroundColor: colors.border,
      marginLeft: 56,
    },
    verticalDivider: {
      width: 1,
      height: '60%' as any,
      backgroundColor: colors.border,
    },

    // ── Input ────────────────────────────────
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
      fontSize: 16,
    },

    // ── Badge / chip ─────────────────────────
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: radii.full,
      borderWidth: 1,
      gap: spacing.xs,
    },
    chip: {
      backgroundColor: colors.chipBackground,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.chipBorder,
    },
    chipText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.chipText,
    },

    // ── Avatar ───────────────────────────────
    avatarContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },

    // ── Ikona-przycisk ───────────────────────
    iconBadge: {
      width: 32,
      height: 32,
      borderRadius: radii.sm,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.surface,
    },

    // ── Empty state ──────────────────────────
    emptyState: {
      backgroundColor: colors.card,
      borderRadius: radii.lg,
      padding: spacing.xxl,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: spacing.sm,
    },
    emptyStateText: {
      fontSize: 14,
      color: colors.subtleText,
      textAlign: 'center',
    },

    // ── Feedback (error / success) ────────────
    errorCard: {
      backgroundColor: colors.dangerBackground,
      borderRadius: radii.md,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: colors.danger,
    },
    errorTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.danger,
      marginBottom: spacing.xs,
    },
    errorSubtitle: {
      fontSize: 13,
      color: colors.danger,
    },
    feedbackBox: {
      borderRadius: radii.md,
      padding: spacing.lg,
      marginTop: spacing.sm,
    },
    feedbackBoxError: {
      backgroundColor: colors.dangerBackground,
    },
    feedbackBoxSuccess: {
      backgroundColor: colors.successBackground,
    },
    feedbackTextError: {
      fontSize: 14,
      color: colors.danger,
    },
    feedbackTextSuccess: {
      fontSize: 14,
      color: colors.success,
    },

    // ── Loader ───────────────────────────────
    loaderWrapper: {
      paddingVertical: 40,
      alignItems: 'center',
    },

    // ── Modal ────────────────────────────────
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
    modalContainer: {
      backgroundColor: colors.card,
      borderRadius: radii.xl,
      padding: spacing.xxl,
      width: '100%',
      maxWidth: 340,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: spacing.sm,
    },
    modalDescription: {
      fontSize: 14,
      color: colors.subtleText,
      textAlign: 'center',
      marginBottom: spacing.xxl,
      lineHeight: 20,
    },
    modalButtonsRow: {
      flexDirection: 'row',
      gap: spacing.md,
      width: '100%',
    },
    modalButton: {
      flex: 1,
      paddingVertical: spacing.md,
      borderRadius: radii.md,
      alignItems: 'center',
    },
    modalButtonCancel: {
      backgroundColor: colors.surface,
    },
    modalButtonConfirm: {
      backgroundColor: '#EF4444',
    },
    modalButtonCancelText: {
      fontWeight: '600',
      color: colors.text,
    },
    modalButtonConfirmText: {
      fontWeight: '600',
      color: 'white',
    },
  });

export function useScreenStyles() {
  return useThemedStyles(createScreenStyles);
}
