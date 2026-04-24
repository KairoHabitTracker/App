import React from 'react';
import { View, Text } from 'react-native';
import { Sparkles } from '@tamagui/lucide-icons';
import { useThemeMode } from '@/src/contexts/ThemeContext';

interface Props {
  message: string;
}

export default function MotivationalCard({ message }: Props) {
  const { colors } = useThemeMode();

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 16,
      marginVertical: 12,
      borderWidth: 1,
      borderColor: colors.accent,
    }}>
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.accent + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
      }}>
        <Sparkles size={24} color={colors.accent} />
      </View>
      <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: colors.text, lineHeight: 22 }}>
        {message}
      </Text>
    </View>
  );
}
