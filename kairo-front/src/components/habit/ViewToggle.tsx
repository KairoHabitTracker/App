import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {ThemeColors} from '@/src/contexts/ThemeContext';
import {useThemedStyles} from '@/src/hooks/useThemedStyles';

interface ViewToggleProps {
  dailyActive: boolean;
  onToggle: (isDaily: boolean) => void;
}

export default function ViewToggle({dailyActive, onToggle}: ViewToggleProps) {
  const styles = useViewToggleStyles();

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, dailyActive && styles.activeButton]}
        onPress={() => onToggle(true)}
      >
        <Text style={[styles.buttonText, dailyActive && styles.activeText]}>Daily</Text>
      </Pressable>
      <Pressable
        style={[styles.button, !dailyActive && styles.activeButton]}
        onPress={() => onToggle(false)}
      >
        <Text style={[styles.buttonText, !dailyActive && styles.activeText]}>Monthly</Text>
      </Pressable>
    </View>
  );
}

const createViewToggleStyles = (colors: ThemeColors) => ({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 4,
    gap: 4,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: colors.accent,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.subtleText,
  },
  activeText: {
    color: colors.card,
  },
});

function useViewToggleStyles() {
  return useThemedStyles(createViewToggleStyles);
}

