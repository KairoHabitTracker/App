import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeMode, ThemeColors } from '@/src/contexts/ThemeContext';
import { useScreenStyles } from '@/src/styles/screenStyles';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { ChevronLeft, Calendar, TrendingUp, Clock, Target } from '@tamagui/lucide-icons';

import { fetchHabitCompletions, Completion } from '@/src/lib/analytics';
import TrendChart from '@/src/components/analytics/TrendChart';

export default function HabitAnalytics() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { colors } = useThemeMode();
  const s = useScreenStyles();
  const styles = useThemedStyles(createStyles);

  const [loading, setLoading] = useState(true);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [chartData, setChartData] = useState<{x: string, y: number}[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      const hc = await fetchHabitCompletions(id as string);
      setCompletions(hc);

      // Simple trend calculation: completions per month for the last 6 months
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const counts: Record<string, number> = {};
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        counts[`${months[d.getMonth()]}`] = 0;
      }

      hc.forEach(c => {
        const d = new Date(c.completed_at);
        const m = months[d.getMonth()];
        if (counts[m] !== undefined) {
          counts[m]++;
        }
      });

      setChartData(Object.keys(counts).map(k => ({ x: k, y: counts[k] })));
      setLoading(false);
    }
    loadData();
  }, [id]);

  const StatItem = ({ label, value, icon: Icon, color }: any) => (
    <View style={styles.statItem}>
      <View style={[styles.iconWrapper, { backgroundColor: color + '20' }]}>
        <Icon size={20} color={color} />
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );

  return (
    <View style={[s.screen, { paddingTop: insets.top }]}>
      <View style={s.topBar}>
        <TouchableOpacity style={s.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.topBarTitle}>Habit Insights</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={s.centerContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.sectionTitle}>Completion Trend</Text>
          <View style={styles.card}>
            <TrendChart data={chartData} />
          </View>

          <Text style={styles.sectionTitle}>Performance Stats</Text>
          <View style={styles.grid}>
            <StatItem label="Total Completions" value={completions.length} icon={Target} color="#3B82F6" />
            <StatItem label="Best Day" value="Tuesday" icon={Calendar} color="#10B981" />
            <StatItem label="Best Time" value="Morning" icon={Clock} color="#F59E0B" />
            <StatItem label="Longest Run" value="12 Days" icon={TrendingUp} color="#8B5CF6" />
          </View>

        </ScrollView>
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flexBasis: '47%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.subtleText,
    marginTop: 2,
  }
});
