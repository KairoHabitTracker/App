import {ScrollView, StyleSheet, Text, View} from "react-native";
import React from 'react';
import {Award, Crown, Gift, Medal, Sparkles, Star, Trophy} from '@tamagui/lucide-icons';

export default function AchievementsScreen() {
    const upcomingAchievements = [
        {
            icon: Trophy,
            color: '#F59E0B',
            bgColor: '#FEF3C7',
            title: 'First Steps',
            description: 'Complete your first habit',
            progress: '0/1',
        },
        {
            icon: Star,
            color: '#3B82F6',
            bgColor: '#DBEAFE',
            title: 'Week Warrior',
            description: 'Complete all habits for 7 days straight',
            progress: '0/7',
        },
        {
            icon: Crown,
            color: '#8B5CF6',
            bgColor: '#EDE9FE',
            title: 'Habit Master',
            description: 'Maintain a 30-day streak',
            progress: '0/30',
        },
        {
            icon: Medal,
            color: '#10B981',
            bgColor: '#D1FAE5',
            title: 'Early Bird',
            description: 'Complete habits before 8 AM for 5 days',
            progress: '0/5',
        },
        {
            icon: Sparkles,
            color: '#EC4899',
            bgColor: '#FCE7F3',
            title: 'Perfectionist',
            description: 'Get 100% completion for a week',
            progress: '0/7',
        },
        {
            icon: Gift,
            color: '#EF4444',
            bgColor: '#FEE2E2',
            title: 'Social Butterfly',
            description: 'Add 5 friends to your network',
            progress: '0/5',
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Achievements</Text>
                <Text style={styles.headerSubtitle}>Unlock rewards as you grow</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.comingSoonCard}>
                    <View style={styles.iconCircle}>
                        <Award size={48} color="#F59E0B"/>
                    </View>
                    <Text style={styles.comingSoonTitle}>Achievements System Coming Soon!</Text>
                    <Text style={styles.comingSoonText}>
                        Get ready to earn badges, unlock rewards, and celebrate your progress!
                    </Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statCardNumber}>0</Text>
                        <Text style={styles.statCardLabel}>Unlocked</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statCardNumber}>🪙 0</Text>
                        <Text style={styles.statCardLabel}>Coins Earned</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>What's Coming</Text>

                {upcomingAchievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                        <View key={index} style={styles.achievementCard}>
                            <View style={[styles.achievementIcon, {backgroundColor: achievement.bgColor}]}>
                                <Icon size={28} color={achievement.color}/>
                            </View>
                            <View style={styles.achievementContent}>
                                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                                <Text style={styles.achievementDescription}>
                                    {achievement.description}
                                </Text>
                                <View style={styles.progressBar}>
                                    <View style={[styles.progressFill, {width: '0%'}]}/>
                                </View>
                                <Text style={styles.progressText}>{achievement.progress}</Text>
                            </View>
                        </View>
                    );
                })}

                <View style={styles.motivationCard}>
                    <Text style={styles.motivationText}>
                        Start completing your habits to unlock these achievements!
                    </Text>
                </View>
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
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    iconCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    comingSoonTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
        textAlign: 'center',
    },
    comingSoonText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
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
    featureCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    featureContent: {
        flex: 1,
        justifyContent: 'center',
    },
    featureTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    placeholderStats: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    statBox: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    statNumber: {
        fontSize: 32,
        fontWeight: '700',
        color: '#3B82F6',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
        color: '#6B7280',
        textAlign: 'center',
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
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    statCardNumber: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    statCardLabel: {
        fontSize: 13,
        color: '#6B7280',
    },
    achievementCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        opacity: 0.6,
    },
    achievementIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    achievementContent: {
        flex: 1,
        justifyContent: 'center',
    },
    achievementTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    achievementDescription: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 4,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#3B82F6',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    motivationCard: {
        backgroundColor: '#EFF6FF',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginTop: 12,
    },
    motivationEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    motivationText: {
        fontSize: 16,
        color: '#1E40AF',
        textAlign: 'center',
        fontWeight: '500',
    },
});