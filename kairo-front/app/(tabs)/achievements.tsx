import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, Text, View} from "react-native";
import {Award, Crown, Flame, Gift, Lock, Medal, Sparkles, Star, Trophy} from '@tamagui/lucide-icons';

// MOCK DANYCH Z BACKENDU
// Symulujemy, że user odblokował już 2 osiągnięcia
const mockApiData = [
    {
        id: 101,
        user_id: "user_123",
        achievement_id: 1,
        unlocked_at: "2024-01-15T10:30:00Z",
        achievement: {
            id: 1,
            identifier: "FIRST_STEPS",
            description: "Complete your first habit",
            image_url: "some_url",
        }
    },
    {
        id: 102,
        user_id: "user_123",
        achievement_id: 2,
        unlocked_at: "2024-01-20T14:15:22Z",
        achievement: {
            id: 2,
            identifier: "WEEK_WARRIOR",
            description: "Complete all habits for 7 days straight",
            image_url: "some_url",
        }
    }
];


//kolorki!!!!
const ACHIEVEMENT_CONFIG: Record<string, any> = {
    'FIRST_STEPS': {
        title: 'First Steps',
        icon: Trophy,
        color: '#F59E0B',
        bgColor: '#FEF3C7',
    },
    'WEEK_WARRIOR': {
        title: 'Week Warrior',
        icon: Star,
        color: '#3B82F6',
        bgColor: '#DBEAFE',
    },
    'HABIT_MASTER': {
        title: 'Habit Master',
        icon: Crown,
        color: '#8B5CF6',
        bgColor: '#EDE9FE',
    },
    'EARLY_BIRD': {
        title: 'Early Bird',
        icon: Medal,
        color: '#10B981',
        bgColor: '#D1FAE5',
    },
    'PERFECTIONIST': {
        title: 'Perfectionist',
        icon: Sparkles,
        color: '#EC4899',
        bgColor: '#FCE7F3',
    },
    'SOCIAL_BUTTERFLY': {
        title: 'Social Butterfly',
        icon: Gift,
        color: '#EF4444',
        bgColor: '#FEE2E2',
    }
};

// Lista wszystkich możliwych osiągnięć (żeby pokazać też te zablokowane)
// pewnie bedziemy potrzebować więcej endpointów
const ALL_ACHIEVEMENTS_LIST = [
    'FIRST_STEPS',
    'WEEK_WARRIOR',
    'HABIT_MASTER',
    'EARLY_BIRD',
    'PERFECTIONIST',
    'SOCIAL_BUTTERFLY'
];

export default function AchievementsScreen() {

    const {unlockedIds, displayList} = useMemo(() => {
        // Zbiór IDków, które user ma odblokowane
        const unlocked = new Set(mockApiData.map(item => item.achievement.identifier));

        // Tworzymy pełną listę do wyświetlenia
        const list = ALL_ACHIEVEMENTS_LIST.map(identifier => {
            const config = ACHIEVEMENT_CONFIG[identifier];
            const isUnlocked = unlocked.has(identifier);

            // Jeśli odblokowane, pobierz datę z mocka API
            const apiData = mockApiData.find(item => item.achievement.identifier === identifier);

            return {
                ...config,
                identifier,
                isUnlocked,
                unlockedAt: apiData ? new Date(apiData.unlocked_at).toLocaleDateString() : null,
                // Tutaj normalnie byłby progress z backendu dla zablokowanych
                progress: isUnlocked ? 'Completed' : 'Locked'
            };
        });

        return {unlockedIds: unlocked, displayList: list};
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Achievements</Text>
                <Text style={styles.headerSubtitle}>Unlock rewards as you grow</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.comingSoonCard}>
                    <View style={styles.iconCircle}>
                        <Award size={40} color="#F59E0B"/>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={styles.comingSoonTitle}>Achievements System</Text>
                        <Text style={styles.comingSoonText}>Earn badges for your consistency.</Text>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statCardNumber}>{unlockedIds.size} / {ALL_ACHIEVEMENTS_LIST.length}</Text>
                        <Text style={styles.statCardLabel}>Unlocked</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statCardNumber}>
                            <Flame size={24} color="#F59E0B"/> {unlockedIds.size * 50}
                        </Text>
                        <Text style={styles.statCardLabel}>Points</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Your Badges</Text>

                {displayList.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <View
                            key={index}
                            style={[
                                styles.achievementCard,
                                !item.isUnlocked && styles.achievementCardLocked
                            ]}
                        >
                            <View style={[
                                styles.achievementIcon,
                                {backgroundColor: item.isUnlocked ? item.bgColor : '#F3F4F6'}
                            ]}>
                                {item.isUnlocked ? (
                                    <Icon size={28} color={item.color}/>
                                ) : (
                                    <Lock size={24} color="#9CA3AF"/>
                                )}
                            </View>

                            <View style={styles.achievementContent}>
                                <Text style={[
                                    styles.achievementTitle,
                                    !item.isUnlocked && {color: '#6B7280'}
                                ]}>
                                    {item.title}
                                </Text>

                                {item.isUnlocked ? (
                                    <Text style={styles.unlockedDate}>
                                        Unlocked on {item.unlockedAt}
                                    </Text>
                                ) : (
                                    <Text style={styles.lockedText}>Keep going to unlock!</Text>
                                )}
                            </View>

                            {item.isUnlocked && (
                                <View style={styles.checkmarkBadge}>
                                    <Award size={16} color="white"/>
                                </View>
                            )}
                        </View>
                    );
                })}

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
        shadowOffset: {width: 0, height: 2},
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
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statCardNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    statCardLabel: {
        fontSize: 12,
        color: '#6B7280',
        textTransform: 'uppercase',
        fontWeight: '600'
    },
    achievementCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    achievementCardLocked: {
        opacity: 0.6,
        backgroundColor: '#F3F4F6',
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
        justifyContent: 'center',
    },
    achievementTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    unlockedDate: {
        fontSize: 12,
        color: '#059669',
        fontWeight: '500'
    },
    lockedText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontStyle: 'italic'
    },
    checkmarkBadge: {
        width: 24,
        height: 24,
        backgroundColor: '#10B981',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8
    }
});