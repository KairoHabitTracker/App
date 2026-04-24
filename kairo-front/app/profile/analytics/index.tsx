import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeMode, ThemeColors } from '@/src/contexts/ThemeContext';
import { useScreenStyles } from '@/src/styles/screenStyles';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { ChevronLeft, BarChart2, Activity, Zap, RefreshCw, PieChart } from '@tamagui/lucide-icons';

import { fetchAllUserHabits, fetchHabitCompletions, computeWeeklyCompletionRate, computeMomentumScore, computeRecoveryRate, Habit, Completion } from '@/src/lib/analytics';
import HeatmapCalendar from '@/src/components/analytics/HeatmapCalendar';
import MotivationalCard from '@/src/components/analytics/MotivationalCard';

export default function AnalyticsDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useThemeMode();
  const s = useScreenStyles();
  const styles = useThemedStyles(createStyles);

  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [allCompletions, setAllCompletions] = useState<Completion[]>([]);

  const [weeklyRate, setWeeklyRate] = useState(0);
  const [momentum, setMomentum] = useState(0);
  const [recovery, setRecovery] = useState(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const userHabits = await fetchAllUserHabits();
      setHabits(userHabits);

      let completions: Completion[] = [];
      for (const h of userHabits) {
        const hc = await fetchHabitCompletions(h.id);
        completions = [...completions, ...hc];
      }
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

          <Text style={styles.sectionTitle}>Deep Dives</Text>
          
          <TouchableOpacity style={styles.linkCard} onPress={() => router.push('/profile/analytics/categories')}>
            <PieChart size={24} color={colors.accent} />
            <Text style={styles.linkText}>Category Balance</Text>
            <ChevronLeft size={20} color={colors.subtleText} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkCard} onPress={() => router.push('/profile/analytics/insights')}>
            <Zap size={24} color={colors.accent} />
            <Text style={styles.linkText}>Smart Insights</Text>
            <ChevronLeft size={20} color={colors.subtleText} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>

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
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  }
});
