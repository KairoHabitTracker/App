import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeMode, ThemeColors } from '@/src/contexts/ThemeContext';
import { useScreenStyles } from '@/src/styles/screenStyles';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { VictoryPie } from 'victory-native';

import { fetchAllUserHabits, fetchHabitCompletions, Habit, Completion } from '@/src/lib/analytics';
import MotivationalCard from '@/src/components/analytics/MotivationalCard';

export default function CategoryAnalytics() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useThemeMode();
  const s = useScreenStyles();
  const styles = useThemedStyles(createStyles);
  const screenWidth = Dimensions.get('window').width;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{x: string, y: number}[]>([]);

  useEffect(() => {
    async function loadData() {
      const userHabits = await fetchAllUserHabits();
      
      const categoryCounts: Record<string, number> = {};
      for (const h of userHabits) {
        const hc = await fetchHabitCompletions(h.id);
        const cat = h.category || 'Uncategorized';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + hc.length;
      }

      const chartData = Object.entries(categoryCounts).map(([k, v]) => ({
        x: k,
        y: v
      })).filter(d => d.y > 0);

      setData(chartData);
      setLoading(false);
    }
    loadData();
  }, []);

  const colorScale = ["#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EF4444", "#EC4899", "#14B8A6"];

  return (
    <View style={[s.screen, { paddingTop: insets.top }]}>
      <View style={s.topBar}>
        <TouchableOpacity style={s.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.topBarTitle}>Categories</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={s.centerContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
          <MotivationalCard message="Balance is key! Look at how your efforts are distributed across life areas." />
          
          <View style={styles.chartContainer}>
            {data.length > 0 ? (
              <VictoryPie
                data={data}
                width={screenWidth - 40}
                height={300}
                colorScale={colorScale}
                innerRadius={60}
                style={{
                  labels: { fill: colors.text, fontSize: 12, fontWeight: 'bold' }
                }}
              />
            ) : (
              <Text style={styles.emptyText}>No data available yet.</Text>
            )}
          </View>

          <Text style={styles.sectionTitle}>Breakdown</Text>
          {data.map((item, idx) => (
            <View key={item.x} style={styles.rowItem}>
              <View style={[styles.dot, { backgroundColor: colorScale[idx % colorScale.length] }]} />
              <Text style={styles.rowText}>{item.x}</Text>
              <Text style={styles.rowValue}>{item.y} completions</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  chartContainer: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  emptyText: {
    color: colors.subtleText,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  rowText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  rowValue: {
    fontSize: 14,
    color: colors.subtleText,
  }
});
