/**
 * colors.ts
 *
 * Stałe kolory UI niezależne od trybu jasny/ciemny (np. tab bar, brand).
 * Kolory zależne od motywu → src/contexts/ThemeContext.ts (ThemeColors)
 */

export const brandColors = {
  /** Kolor tła paska zakładek */
  tabBar: '#54BEFF',
  /** Kolor nieaktywnej zakładki */
  tabBarInactive: '#B8E6FF',
  /** Kolor aktywnej zakładki / tekstu */
  tabBarActive: '#FFFFFF',

  /** Główny akcent marki (przyciski, badge'y) */
  accent: '#3B82F6',
  /** Akcent ciemny (badge tabbar) */
  accentDark: '#6366F1',

  /** Kolor sukcesu */
  success: '#22C55E',
  /** Kolor ostrzeżenia */
  warning: '#F97316',
  /** Kolor błędu / niebezpieczeństwa */
  danger: '#EF4444',
} as const;
