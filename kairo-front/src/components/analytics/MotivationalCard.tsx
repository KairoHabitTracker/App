import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles } from '@tamagui/lucide-icons';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { ThemeColors } from '@/src/contexts/ThemeContext';

interface Props {
  message: string;
}

export default function MotivationalCard({ message }: Props) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Sparkles size={24} color="#F59E0B" />
      </View>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 16,
      marginVertical: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    text: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      lineHeight: 22,
    },
  });
