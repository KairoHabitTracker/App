import React, {useMemo} from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {Award, Calendar, CheckCircle, Crown, Flame, Gem, Lock, Shield, Sparkles, Star, Sun, Sunrise, Trophy, Zap} from '@tamagui/lucide-icons';
import {useAchievements} from '@/src/hooks/useAchievements';

type IconComponent = React.ComponentType<any>;

type AchievementVisualConfig = {
    title: string;
    icon: IconComponent;
    color: string;
    bgColor: string;
};

const ACHIEVEMENT_CONFIG: Record<string, AchievementVisualConfig> = {
    first_habit: {
        title: 'First Habit Complete',
        icon: CheckCircle,
        color: '#22C55E',
        bgColor: '#DCFCE7',
    },
    complete_a_day: {
        title: 'Daily Dominator',
        icon: Calendar,
        color: '#F97316',
        bgColor: '#FFEDD5',
    },
    habit_streak_7: {
        title: '7-Day Streak',
        icon: Flame,
        color: '#F59E0B',
        bgColor: '#FEF3C7',
    },
    habit_streak_14: {
        title: '14-Day Streak',
        icon: Sunrise,
        color: '#EC4899',
        bgColor: '#FDF2F8',
    },
    habit_streak_30: {
        title: '30-Day Streak',
        icon: Sun,
        color: '#FACC15',
        bgColor: '#FEF9C3',
    },
    habit_streak_90: {
        title: '90-Day Streak',
        icon: Zap,
        color: '#14B8A6',
        bgColor: '#CCFBF1',
    },
    habit_streak_365: {
        title: 'Year-Long Flame',
        icon: Crown,
        color: '#A855F7',
        bgColor: '#F3E8FF',
    },
    complete_3_habits: {
        title: 'Trio Completed',
        icon: Sparkles,
        color: '#8B5CF6',
        bgColor: '#EDE9FE',
    },
    complete_20_habits: {
        title: '20 Habits',
        icon: Star,
        color: '#3B82F6',
        bgColor: '#DBEAFE',
    },
    complete_50_habits: {
        title: '50 Habits',
        icon: Trophy,
        color: '#D97706',
        bgColor: '#FFFBEB',
    },
    complete_100_habits: {
        title: 'Century Club',
        icon: Award,
        color: '#0EA5E9',
        bgColor: '#E0F2FE',
    },
    complete_500_habits: {
        title: '500 Habits',
        icon: Shield,
        color: '#6366F1',
        bgColor: '#E0E7FF',
    },
    complete_1000_habits: {
        title: 'Legendary 1000',
        icon: Gem,
        color: '#EC4899',
        bgColor: '#FCE7F3',
    },
};

const DEFAULT_CONFIG: AchievementVisualConfig = {
    title: 'Achievement',
    icon: Trophy,
    color: '#6B7280',
    bgColor: '#E5E7EB',
};

const formatIdentifier = (identifier: string) =>
    identifier
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

type DisplayAchievement = {
    id: number;
    title: string;
    description: string;
    identifier: string;
    icon: IconComponent;
    color: string;
    bgColor: string;
    isUnlocked: boolean;
    unlockedAt: string | null;
};

export default function AchievementsScreen() {
    const {achievements, loading, error, refresh, total, unlockedCount, pointsEarned} = useAchievements();

    const displayList = useMemo<DisplayAchievement[]>(() => {
        return achievements
            .map((entry) => {
                const identifier = entry.achievement?.identifier ?? `achievement-${entry.id}`;
                const config = ACHIEVEMENT_CONFIG[identifier] ?? {
                    ...DEFAULT_CONFIG,
                    title: entry.achievement?.description ? formatIdentifier(identifier) : DEFAULT_CONFIG.title,
                };

                const isUnlocked = Boolean(entry.unlocked_at);
                const unlockedAt = entry.unlocked_at
                    ? new Date(entry.unlocked_at).toLocaleDateString()
                    : null;

                return {
                    id: entry.id,
                    identifier,
                    title: config.title || formatIdentifier(identifier),
                    description: entry.achievement?.description ?? formatIdentifier(identifier),
                    icon: config.icon,
                    color: config.color,
                    bgColor: config.bgColor,
                    isUnlocked,
                    unlockedAt,
                };
            })
            .sort((a, b) => {
                if (a.isUnlocked === b.isUnlocked) return 0;
                return a.isUnlocked ? -1 : 1;
            });
    }, [achievements]);

    const showEmptyState = !loading && displayList.length === 0;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Achievements</Text>
                <Text style={styles.headerSubtitle}>Track every badge you unlock</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor="#111827" />}
            >
                <View style={styles.comingSoonCard}>
                    <View style={styles.iconCircle}>
                        <Award size={40} color="#F59E0B" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.comingSoonTitle}>Consistency Pays Off</Text>
                        <Text style={styles.comingSoonText}>Complete habits daily to climb the badge ladder.</Text>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statCardNumber}>
                            {unlockedCount} / {total || '—'}
                        </Text>
                        <Text style={styles.statCardLabel}>Unlocked</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statCardNumber}>
                            <Flame size={20} color="#F59E0B" /> {pointsEarned}
                        </Text>
                        <Text style={styles.statCardLabel}>Points</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Your Badges</Text>

                {error && (
                    <View style={styles.errorCard}>
                        <Text style={styles.errorTitle}>Could not load achievements</Text>
                        <Text style={styles.errorSubtitle}>{error}</Text>
                    </View>
                )}

                {loading && !displayList.length ? (
                    <View style={styles.loaderWrapper}>
                        <ActivityIndicator size="large" color="#111827" />
                    </View>
                ) : showEmptyState ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateTitle}>No achievements yet</Text>
                        <Text style={styles.emptyStateText}>Start completing habits to earn your first badge.</Text>
                    </View>
                ) : (
                    displayList.map((item) => {
                        const Icon = item.icon;
                        return (
                            <View
                                key={item.id}
                                style={[styles.achievementCard, !item.isUnlocked && styles.achievementCardLocked]}
                            >
                                <View
                                    style={[
                                        styles.achievementIcon,
                                        { backgroundColor: item.isUnlocked ? item.bgColor : '#F3F4F6' },
                                    ]}
                                >
                                    
                                    {item.isUnlocked ? <Icon size={28} color={item.color} /> : <Lock size={24} color="#9CA3AF" />}
                                </View>

                                <View style={styles.achievementContent}>
                                    <Text style={[styles.achievementTitle, !item.isUnlocked && { color: '#6B7280' }]}>
                                        {item.title}
                                    </Text>
                                    <Text style={styles.achievementDescription}>{item.description}</Text>
                                    {item.isUnlocked ? (
                                        <Text style={styles.unlockedDate}>Unlocked on {item.unlockedAt}</Text>
                                    ) : (
                                        <Text style={styles.lockedText}>Keep going to unlock this badge.</Text>
                                    )}
                                </View>

                                {item.isUnlocked && (
                                    <View style={styles.checkmarkBadge}>
                                        <Award size={16} color="white" />
                                    </View>
                                )}
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    comingSoonCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFFBEB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    comingSoonTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    comingSoonText: {
        fontSize: 14,
        color: '#6B7280',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
        marginTop: 8,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statCardNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
        textAlign: 'center',
    },
    statCardLabel: {
        fontSize: 12,
        color: '#6B7280',
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    errorCard: {
        backgroundColor: '#FEF2F2',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#FCA5A5',
    },
    errorTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#B91C1C',
        marginBottom: 4,
    },
    errorSubtitle: {
        fontSize: 13,
        color: '#7F1D1D',
    },
    loaderWrapper: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyState: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
    achievementCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    achievementCardLocked: {
        backgroundColor: '#F8FAFC',
    },
    achievementIcon: {
        width: 52,
        height: 52,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    achievementContent: {
        flex: 1,
    },
    achievementTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 2,
    },
    achievementDescription: {
        fontSize: 13,
        color: '#4B5563',
        marginBottom: 4,
    },
    unlockedDate: {
        fontSize: 12,
        color: '#059669',
        fontWeight: '500',
    },
    lockedText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 8,
    },
    checkmarkBadge: {
        width: 32,
        height: 32,
        backgroundColor: '#10B981',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
});