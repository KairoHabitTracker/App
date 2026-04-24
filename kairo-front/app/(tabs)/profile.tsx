import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { apiFetch } from '@/src/lib/api';
import { ApiProfileResponse } from '@/src/types/apiTypes';
import { UserProfile } from '@/src/types/types';
import { deleteItemAsync } from '@/src/lib/secureStore';
import {
  isAnalyticsMockEnabled,
  setAnalyticsMockEnabled,
} from '../../src/lib/devAnalyticsMock';

import ProfileAvatar from '@/src/components/ProfileAvatar';
import {
  ChevronRight,
  Coins,
  CreditCard,
  Edit3,
  Flame,
  List,
  Settings,
  TrendingUp,
} from '@tamagui/lucide-icons';
import { ThemeColors, useThemeMode } from '@/src/contexts/ThemeContext';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { useScreenStyles } from '@/src/styles/screenStyles';

async function fetchUserProfile(): Promise<UserProfile> {
  const json: ApiProfileResponse = await apiFetch('/api/profile');
  const info = json.data?.info;
  return {
    id: json.data.id,
    username: info?.name ?? json.data.email ?? 'User',
    avatarUrl: info?.avatar_url ?? null,
    streak: info?.streak ?? 0,
    coins: info?.coins ?? 0,
    subscription: info?.subscription ?? 'Free',
  };
}

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useThemeMode();
  const s = useScreenStyles();
  const styles = useProfileStyles();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chartData, setChartData] = useState<{ x: string, y: number }[]>([]);
  const [mockAnalyticsEnabled, setMockAnalyticsEnabledState] = useState(isAnalyticsMockEnabled());

  const loadData = useCallback(async () => {
    try {
      const data = await fetchUserProfile();
      setProfile(data);

      try {
        const { fetchAllUserHabits, fetchHabitCompletions } = await import('@/src/lib/analytics');
        const habits = await fetchAllUserHabits();
        const recentCompletions: any[] = [];
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        for (const h of habits) {
          const hc = await fetchHabitCompletions(h.id);
          recentCompletions.push(...hc.filter((c: any) => new Date(c.completed_at) >= sevenDaysAgo));
        }

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const counts: Record<string, number> = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
        recentCompletions.forEach((c: any) => {
          const d = new Date(c.completed_at);
          counts[days[d.getDay()]] += 1;
        });

        const orderedChartData = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          const dayName = days[d.getDay()];
          orderedChartData.push({ x: dayName, y: counts[dayName] });
        }
        setChartData(orderedChartData);
      } catch (e) {
        console.warn('Failed to load chart data', e);
      }

    } catch (error: any) {
      console.error('Profile load error', error);
      if (error.status === 401) {
        await deleteItemAsync('authToken');
        router.replace('/login');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const toggleMockAnalytics = useCallback(() => {
    const nextValue = !mockAnalyticsEnabled;
    setAnalyticsMockEnabled(nextValue);
    setMockAnalyticsEnabledState(nextValue);
    loadData();
  }, [loadData, mockAnalyticsEnabled]);

  if (loading) {
    return (
      <View style={s.centerContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!profile) return null;

  const { username, streak, coins, avatarUrl, subscription } = profile;

  const StatBox = ({ icon: Icon, value, label, color }: any) => (
    <View style={styles.statBox}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
        <Icon size={20} color={color} />
      </View>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );

  const MenuItem = ({ icon: Icon, title, onPress, color = colors.text }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuLeft}>
        <View style={s.iconBadge}>
          <Icon size={20} color={color} />
        </View>
        <Text style={s.itemTitle}>{title}</Text>
      </View>
      <ChevronRight size={20} color={colors.subtleText} />
    </TouchableOpacity>
  );

  return (
    <View style={[s.screen, { paddingTop: insets.top }]}>
      <View style={s.topBar}>
        <Text style={s.topBarTitle}>Profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ProfileAvatar
            username={username}
            avatarUrl={avatarUrl}
            size={100}
            style={styles.avatarShadow}
          />
          <Text style={styles.username}>{username}</Text>
          <Text style={[s.itemSubtext, { marginTop: 4 }]}>
            @{username?.toLowerCase().replace(/\s/g, '')}
          </Text>
        </View>

        <View
          style={[
            s.cardHorizontalMargin,
            {
              flexDirection: 'row',
              paddingVertical: 16,
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}>
          <StatBox icon={Flame} value={streak} label="Streak" color="#F59E0B" />
          <View style={s.verticalDivider} />
          <StatBox icon={Coins} value={coins} label="Coins" color="#EAB308" />
          <View style={s.verticalDivider} />
          <StatBox icon={CreditCard} value={subscription} label="Plan" color="#3B82F6" />
        </View>

        <Text style={s.sectionTitlePadded}>Management</Text>

        <View style={[s.cardGroup, { marginHorizontal: 20 }]}>
          <MenuItem
            icon={List}
            title="My Habits"
            color="#3B82F6"
            onPress={() => router.push('/habit/all')}
          />
          <View style={s.dividerIndented} />
          <MenuItem
            icon={Edit3}
            title="Edit Profile"
            onPress={() => router.push('../profile/edit')}
          />
          <View style={s.dividerIndented} />
          <MenuItem
            icon={Settings}
            title="App Settings"
            onPress={() => router.push('../settings')}
          />
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={s.sectionTitlePadded}>Insights</Text>

          {__DEV__ && (
            <TouchableOpacity
              style={[styles.devToggle, mockAnalyticsEnabled && styles.devToggleActive]}
              onPress={toggleMockAnalytics}
              activeOpacity={0.8}
            >
              <Text style={[styles.devToggleText, mockAnalyticsEnabled && styles.devToggleTextActive]}>
                {mockAnalyticsEnabled ? 'Mock data on' : 'Mock data off'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartCopy}>
            <Text style={styles.chartTitle}>Weekly completion bar</Text>
            <Text style={styles.chartSubtitle}>
              {mockAnalyticsEnabled
                ? 'Temporary mock data is active for UI testing.'
                : 'Live completions from the last 7 days.'}
            </Text>
          </View>

          {chartData.length > 0 ? (
            <VictoryChart
              height={180}
              width={Dimensions.get('window').width - 72}
              domain={{ y: [0, Math.max(1, ...chartData.map(d => d.y))] }}
              padding={{ top: 12, bottom: 32, left: 18, right: 18 }}
            >
              <VictoryAxis
                style={{
                  axis: { stroke: 'transparent' },
                  tickLabels: { fill: colors.subtleText, fontSize: 10, padding: 6 },
                }}
              />
              <VictoryAxis
                dependentAxis
                style={{
                  axis: { stroke: 'transparent' },
                  tickLabels: { fill: colors.subtleText, fontSize: 10, padding: 4 },
                  grid: { stroke: colors.border, strokeDasharray: '3,3' },
                }}
              />
              <VictoryBar
                data={chartData}
                animate={{ duration: 700, onLoad: { duration: 300 } }}
                style={{ data: { fill: colors.accent, width: 18, opacity: 0.95 } }}
                cornerRadius={{ top: 6, bottom: 6 }}
                barRatio={0.85}
              />
            </VictoryChart>
          ) : (
            <Text style={styles.emptyChartText}>No weekly data yet.</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.analyticsCard}
          onPress={() => router.push('/profile/analytics')}
          activeOpacity={0.8}
        >
          <View style={styles.analyticsLeft}>
            <View style={styles.analyticsIconWrapper}>
              <TrendingUp size={24} color="white" />
            </View>
            <View>
              <Text style={styles.analyticsTitle}>Analytics Dashboard</Text>
              <Text style={styles.analyticsSubtext}>View trends and consistency</Text>
            </View>
          </View>
          <ChevronRight size={24} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const createProfileStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    header: {
      alignItems: 'center',
      paddingTop: 10,
      paddingBottom: 24,
    },
    username: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      marginTop: 16,
    },
    avatarShadow: {
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
      backgroundColor: colors.surface,
    },
    statBox: {
      flex: 1,
      alignItems: 'center',
    },
    statIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: colors.card,
    },
    menuLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    analyticsCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.accent,
      marginHorizontal: 20,
      borderRadius: 16,
      padding: 20,
    },
    analyticsLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    analyticsIconWrapper: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    analyticsTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: 'white',
    },
    analyticsSubtext: {
      fontSize: 13,
      color: 'rgba(255,255,255,0.8)',
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginRight: 20,
    },
    devToggle: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    devToggleActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    devToggleText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.text,
    },
    devToggleTextActive: {
      color: 'white',
    },
    chartCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      marginHorizontal: 20,
      marginBottom: 16,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    chartCopy: {
      marginBottom: 8,
    },
    chartTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 2,
    },
    chartSubtitle: {
      fontSize: 12,
      color: colors.subtleText,
    },
    emptyChartText: {
      color: colors.subtleText,
      paddingVertical: 24,
      textAlign: 'center',
    },
  });

const useProfileStyles = () => useThemedStyles(createProfileStyles);
