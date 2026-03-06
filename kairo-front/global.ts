import {StyleSheet} from 'react-native';

/**
 * global.ts – minimalne pozostałości legacy.
 * Nowe style → src/styles/screenStyles.ts (useScreenStyles)
 *              src/styles/authStyles.ts
 *              src/styles/friendsStyles.ts
 */

// Używane przez app/+not-found.tsx
export const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
    maxWidth: 520,
  },
  button: {
    backgroundColor: '#1F2937',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  smallNote: {
    marginTop: 16,
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 420,
  },
});
