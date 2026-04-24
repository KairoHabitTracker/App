import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { ThemeColors } from '@/src/contexts/ThemeContext';

interface Props {
  completedDates: string[]; // ISO string or Date string
}

export default function HeatmapCalendar({ completedDates }: Props) {
  const styles = useThemedStyles(createStyles);
  const datesSet = new Set(completedDates.map(d => new Date(d).toDateString()));
  
  const today = new Date();
  // Generate last 28 days
  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(today.getTime() - (27 - i) * 24 * 60 * 60 * 1000);
    return {
      date: d,
      completed: datesSet.has(d.toDateString()),
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {days.map((day, i) => (
          <View 
            key={i} 
            style={[
              styles.cell, 
              day.completed ? styles.cellCompleted : styles.cellEmpty,
              i === 27 && styles.cellToday // highlight today
            ]} 
          />
        ))}
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 7 * 24 + 10, // 7 cols of 24px + extra width
    justifyContent: 'center',
    gap: 4,
  },
  cell: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  cellEmpty: {
    backgroundColor: colors.border,
    opacity: 0.4,
  },
  cellCompleted: {
    backgroundColor: colors.accent,
  },
  cellToday: {
    borderWidth: 2,
    borderColor: colors.text,
  }
});
