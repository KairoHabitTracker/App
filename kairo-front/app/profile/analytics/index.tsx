import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeMode, ThemeColors } from '@/src/contexts/ThemeContext';
import { useScreenStyles } from '@/src/styles/screenStyles';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { ChevronLeft, BarChart2, Activity, Zap, RefreshCw, Lightbulb } from '@tamagui/lucide-icons';
import { VictoryPie } from 'victory-native';

import { fetchAllUserHabits, fetchHabitCompletions, computeWeeklyCompletionRate, computeMomentumScore, computeRecoveryRate, Habit, Completion } from '@/src/lib/analytics';
import HeatmapCalendar from '@/src/components/analytics/HeatmapCalendar';
import MotivationalCard from '@/src/components/analytics/MotivationalCard';

const CATEGORIES = ['All', 'health', 'sport', 'work', 'chores', 'commitments', 'physical wellbeing', 'mental wellbeing', 'social', 'financial', 'hobbies', 'learning', 'productivity', 'bad habbit (addiction)'];
const CATEGORY_COLOR_MAP: Record<string, string> = {
  health: '#F59E0B',
  sport: '#3B82F6',
  work: '#6366F1',
  chores: '#EF4444',
  commitments: '#14B8A6',
  'physical wellbeing': '#EC4899',
  'mental wellbeing': '#8B5CF6',
  social: '#10B981',
  financial: '#0EA5E9',
  hobbies: '#F97316',
  learning: '#22C55E',
  productivity: '#6366F1',
  'bad habbit (addiction)': '#DC2626',
  uncategorized: '#94A3B8',
};

function normalizeCategoryKey(category?: string): string {
  return (category || 'uncategorized').trim().toLowerCase();
}

function getCategoryColor(categoryKey?: string): string {
  const key = normalizeCategoryKey(categoryKey);
  return CATEGORY_COLOR_MAP[key] || '#64748B';
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.replace('#', '');
  const parsed = parseInt(normalized, 16);
  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (value: number) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function lightenColor(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const mix = (channel: number) => channel + (255 - channel) * amount;
  return rgbToHex(mix(r), mix(g), mix(b));
}

export default function AnalyticsDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useThemeMode();
  const s = useScreenStyles();
  const styles = useThemedStyles(createStyles);
  const screenWidth = Dimensions.get('window').width;

  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [allCompletions, setAllCompletions] = useState<Completion[]>([]);
  const [habitCompletionTotals, setHabitCompletionTotals] = useState<{ habit: Habit; completions: number }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [weeklyRate, setWeeklyRate] = useState(0);
  const [momentum, setMomentum] = useState(0);
  const [recovery, setRecovery] = useState(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const userHabits = await fetchAllUserHabits();
      setHabits(userHabits);

      let completions: Completion[] = [];
      const habitTotals: { habit: Habit; completions: number }[] = [];
      for (const h of userHabits) {
        const hc = await fetchHabitCompletions(h.id);
        habitTotals.push({ habit: h, completions: hc.length });
        completions = [...completions, ...hc];
      }
      setHabitCompletionTotals(habitTotals);
      setAllCompletions(completions);

      setWeeklyRate(computeWeeklyCompletionRate(completions));
      setMomentum(computeMomentumScore(completions));
      
      // Assume account created 30 days ago for placeholder if we don't have user profile here
      const accountCreatedAt = new Date();
      accountCreatedAt.setDate(accountCreatedAt.getDate() - 30);
      setRecovery(computeRecoveryRate(completions, accountCreatedAt));

      setLoading(false);
    }

    loadData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <View style={styles.statCard}>
      <View style={[styles.iconWrapper, { backgroundColor: color + '20' }]}>
        <Icon size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const getCategoryChartData = () => {
    const selectedKey = normalizeCategoryKey(selectedCategory);

    if (selectedCategory === 'All') {
      const categoryCounts: Record<string, { display: string; value: number }> = {};
      for (const { habit, completions } of habitCompletionTotals) {
        const display = habit.category || 'Uncategorized';
        const key = normalizeCategoryKey(display);

        if (!categoryCounts[key]) {
          categoryCounts[key] = { display, value: 0 };
        }
        categoryCounts[key].value += completions;
      }

      return Object.entries(categoryCounts)
        .map(([key, payload]) => ({
          x: payload.display,
          y: payload.value,
          categoryKey: key,
          color: getCategoryColor(key),
        }))
        .filter(item => item.y > 0);
    }

    const filteredData = habitCompletionTotals
      .filter(({ habit }) => normalizeCategoryKey(habit.category) === selectedKey)
      .map(({ habit, completions }) => ({
        x: habit.name,
        y: completions,
        categoryKey: selectedKey,
        color: getCategoryColor(selectedKey),
      }))
      .filter(item => item.y > 0);

    const baseColor = getCategoryColor(selectedKey);
    const shadeStep = filteredData.length > 1 ? 0.38 / (filteredData.length - 1) : 0;

    return filteredData.map((item, index) => ({
      ...item,
      color: lightenColor(baseColor, shadeStep * index),
    }));
  };

  const categoryChartData = getCategoryChartData();
  const categoryTotal = categoryChartData.reduce((sum, item) => sum + item.y, 0);

  const InsightCard = ({ text }: { text: string }) => (
    <View style={styles.insightCard}>
      <View style={styles.insightIconWrapper}>
        <Lightbulb size={20} color="#F59E0B" />
      </View>
      <Text style={styles.insightText}>{text}</Text>
    </View>
  );

  return (
    <View style={[s.screen, { paddingTop: insets.top }]}>
      <View style={s.topBar}>
        <TouchableOpacity style={s.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.topBarTitle}>Analytics</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={s.centerContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
          {/* Note: In the future, this motivational content could be fetched from a backend API */}
          <MotivationalCard message="You are more consistent now than during your first month! Keep it up." />

          <View style={styles.statsRow}>
            <StatCard title="Weekly Rate" value={`${weeklyRate}%`} icon={Activity} color="#3B82F6" />
            <StatCard title="Momentum" value={momentum.toString()} icon={Zap} color="#F59E0B" />
          </View>
          <View style={styles.statsRow}>
            <StatCard title="Recovery Rate" value={`${recovery}%`} icon={RefreshCw} color="#10B981" />
            <StatCard title="Total Habits" value={habits.length.toString()} icon={BarChart2} color="#8B5CF6" />
          </View>

          <Text style={styles.sectionTitle}>Activity Heatmap</Text>
          <HeatmapCalendar completedDates={allCompletions.map(c => c.completed_at)} />

          <Text style={styles.sectionTitle}>Category Balance</Text>
          <View style={styles.filterScroll}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsRow}>
              {CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[styles.filterChip, selectedCategory === category && styles.filterChipActive]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[styles.filterChipText, selectedCategory === category && styles.filterChipTextActive]}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.pieCard}>
            {categoryChartData.length > 0 ? (
              <VictoryPie
                data={categoryChartData}
                width={screenWidth - 40}
                height={280}
                innerRadius={58}
                labels={({ datum }: any) => {
                  const percentage = categoryTotal > 0 ? Math.round((datum.y / categoryTotal) * 100) : 0;
                  return `${datum.x}\n${percentage}%`;
                }}
                style={{
                  labels: { fill: colors.text, fontSize: 11, fontWeight: '700' },
                  data: {
                    fill: ({ datum }: any) => datum.color,
                  },
                }}
              />
            ) : (
              <Text style={styles.emptyText}>No data available for {selectedCategory}.</Text>
            )}
          </View>

          {categoryChartData.map((item, idx) => (
            <View key={item.x} style={styles.rowItem}>
              <View style={[styles.dot, { backgroundColor: item.color }]} />
              <Text style={styles.rowText}>{item.x}</Text>
              <Text style={styles.rowValue}>{item.y} completions</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Smart Insights</Text>
          <InsightCard text="When you complete your morning habits, you are more likely to finish your daily stack." />
          <InsightCard text="Your strongest consistency window appears to be mid-week. Protect that rhythm." />
          <InsightCard text="You recover quickly after missed days, which is a strong long-term growth signal." />

        </ScrollView>
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 13,
    color: colors.subtleText,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  filterScroll: {
    marginBottom: 8,
  },
  filterChipsRow: {
    paddingRight: 8,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterChipText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: 'white',
  },
  pieCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  emptyText: {
    color: colors.subtleText,
    paddingVertical: 24,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
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
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  insightIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    marginRight: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
    fontWeight: '500',
  },
});
