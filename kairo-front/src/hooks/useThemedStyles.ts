import {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {ThemeColors, useThemeMode} from '@/src/contexts/ThemeContext';

type ThemedFactory = (colors: ThemeColors) => Record<string, any>;

export function useThemedStyles(factory: ThemedFactory): Record<string, any> {
  const {colors} = useThemeMode();
  return useMemo(() => {
    const created = StyleSheet.create(factory(colors) as StyleSheet.NamedStyles<any>);
    return created as Record<string, any>;
  }, [factory, colors]);
}
