import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { ThemeColors } from '@/src/contexts/ThemeContext';

interface Props {
  completedDates: string[]; // ISO string or Date string
}

const CELL_SIZE = 24;
const CELL_GAP = 6;
const GRID_WIDTH = CELL_SIZE * 7 + CELL_GAP * 6;
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const INTENSITY_COLORS = ['#E5E7EB', '#D1FAE5', '#86EFAC', '#34D399', '#059669'];

function getIntensityIndex(count: number): number {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
}

export default function HeatmapCalendar({ completedDates }: Props) {
  const styles = useThemedStyles(createStyles);
  const completionCountByDay = completedDates.reduce<Record<string, number>>((acc, completedDate) => {
    const key = new Date(completedDate).toDateString();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  
  const today = new Date();
  // Generate last 28 days
  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(today.getTime() - (27 - i) * 24 * 60 * 60 * 1000);
    const dateKey = d.toDateString();
    const completionCount = completionCountByDay[dateKey] || 0;
    return {
      date: d,
      completionCount,
      intensityIndex: getIntensityIndex(completionCount),
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label, index) => (
          <Text key={label} style={[styles.weekdayLabel, index === 6 && styles.weekdayLabelLast]}>
            {label}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((day, index) => (
          <View
            key={`${index}-${day.date.toISOString()}`}
            style={[
              styles.cell,
              index % 7 === 6 && styles.cellNoRightMargin,
              { backgroundColor: INTENSITY_COLORS[day.intensityIndex] },
              index === 27 && styles.cellToday,
            ]}
          />
        ))}
      </View>

      <View style={styles.legendRow}>
        <Text style={styles.legendLabel}>Less</Text>
        {INTENSITY_COLORS.map(color => (
          <View key={color} style={[styles.legendSwatch, { backgroundColor: color }]} />
        ))}
        <Text style={styles.legendLabel}>More</Text>
      </View>
      <Text style={styles.legendHint}>Color indicates habits completed per day (0, 1, 2, 3, 4+)</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: colors.card,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  weekdayRow: {
    width: GRID_WIDTH,
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayLabel: {
    width: CELL_SIZE,
    marginRight: CELL_GAP,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: colors.subtleText,
  },
  weekdayLabelLast: {
    marginRight: 0,
  },
  grid: {
    width: GRID_WIDTH,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 4,
    marginRight: CELL_GAP,
    marginBottom: CELL_GAP,
  },
  cellNoRightMargin: {
    marginRight: 0,
  },
  cellToday: {
    borderWidth: 2,
    borderColor: colors.text,
  },
  legendRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendSwatch: {
    width: 14,
    height: 14,
    borderRadius: 4,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  legendLabel: {
    fontSize: 11,
    color: colors.subtleText,
    marginHorizontal: 6,
  },
  legendHint: {
    marginTop: 6,
    fontSize: 11,
    color: colors.subtleText,
  },
});
