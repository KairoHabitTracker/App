import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from "react-native";
import {Bell, BellOff, Calendar, Clock, MessageSquare, Trophy, Users} from '@tamagui/lucide-icons';

export default function NotificationsScreen() {
    const [pushEnabled, setPushEnabled] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [vibrationEnabled, setVibrationEnabled] = useState(true);
    const [reminderEnabled, setReminderEnabled] = useState(true);
    const [achievementEnabled, setAchievementEnabled] = useState(true);
    const [socialEnabled, setSocialEnabled] = useState(true);

    const upcomingFeatures = [
        {
            icon: Clock,
            color: '#3B82F6',
            bgColor: '#DBEAFE',
            title: 'Smart Reminders',
            description: 'Get notified at the perfect time to complete your habits',
        },
        {
            icon: Calendar,
            color: '#10B981',
            bgColor: '#D1FAE5',
            title: 'Streak Alerts',
            description: "Don't break your streak! We'll remind you before midnight",
        },
        {
            icon: Trophy,
            color: '#F59E0B',
            bgColor: '#FEF3C7',
            title: 'Achievement Unlocked',
            description: 'Celebrate your milestones with instant notifications',
        },
        {
            icon: Users,
            color: '#EC4899',
            bgColor: '#FCE7F3',
            title: 'Friend Activity',
            description: 'See when friends complete habits or send you challenges',
        },
        {
            icon: MessageSquare,
            color: '#8B5CF6',
            bgColor: '#EDE9FE',
            title: 'Motivational Messages',
            description: 'Daily encouragement to keep you on track',
        },
    ];

    const mockNotifications = [
        {
            icon: Bell,
            color: '#3B82F6',
            bgColor: '#DBEAFE',
            title: 'Reminder: Drink Water',
            description: 'Time to complete your habit!',
            time: '2 hours ago',
        },
        {
            icon: Trophy,
            color: '#F59E0B',
            bgColor: '#FEF3C7',
            title: 'Achievement Unlocked!',
            description: 'You earned "First Steps" badge',
            time: '5 hours ago',
        },
        {
            icon: Users,
            color: '#EC4899',
            bgColor: '#FCE7F3',
            title: 'Friend Request',
            description: 'John wants to connect with you',
            time: 'Yesterday',
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notifications</Text>
                <Text style={styles.headerSubtitle}>
                    Stay on track with smart reminders
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.comingSoonCard}>
                    <View style={styles.iconCircle}>
                        <Bell size={48} color="#3B82F6"/>
                    </View>
                    <Text style={styles.comingSoonTitle}>Notifications Coming Soon!</Text>
                    <Text style={styles.comingSoonText}>
                        We're building a smart notification system to help you stay consistent with your habits.
                    </Text>
                </View>

                {/*<Text style={styles.sectionTitle}>Notification Settings</Text>*/}

                {/*<View style={styles.settingsCard}>*/}
                {/*    <View style={styles.settingRow}>*/}
                {/*        <View style={styles.settingInfo}>*/}
                {/*            <Smartphone size={20} color="#3B82F6" style={styles.settingIcon}/>*/}
                {/*            <View style={styles.settingText}>*/}
                {/*                <Text style={styles.settingTitle}>Push Notifications</Text>*/}
                {/*                <Text style={styles.settingDescription}>*/}
                {/*                    Receive habit reminders on your device*/}
                {/*                </Text>*/}
                {/*            </View>*/}
                {/*        </View>*/}
                {/*        <Switch*/}
                {/*            value={pushEnabled}*/}
                {/*            onValueChange={setPushEnabled}*/}
                {/*            trackColor={{false: '#E5E7EB', true: '#93C5FD'}}*/}
                {/*            thumbColor={pushEnabled ? '#3B82F6' : '#F3F4F6'}*/}
                {/*        />*/}
                {/*    </View>*/}

                {/*    <View style={styles.divider}/>*/}

                {/*    <View style={styles.settingRow}>*/}
                {/*        <View style={styles.settingInfo}>*/}
                {/*            <Volume2 size={20} color="#10B981" style={styles.settingIcon}/>*/}
                {/*            <View style={styles.settingText}>*/}
                {/*                <Text style={styles.settingTitle}>Sound</Text>*/}
                {/*                <Text style={styles.settingDescription}>*/}
                {/*                    Play sound with notifications*/}
                {/*                </Text>*/}
                {/*            </View>*/}
                {/*        </View>*/}
                {/*        <Switch*/}
                {/*            value={soundEnabled}*/}
                {/*            onValueChange={setSoundEnabled}*/}
                {/*            trackColor={{false: '#E5E7EB', true: '#93C5FD'}}*/}
                {/*            thumbColor={soundEnabled ? '#3B82F6' : '#F3F4F6'}*/}
                {/*        />*/}
                {/*    </View>*/}

                {/*    <View style={styles.divider}/>*/}

                {/*    <View style={styles.settingRow}>*/}
                {/*        <View style={styles.settingInfo}>*/}
                {/*            <Smartphone size={20} color="#F59E0B" style={styles.settingIcon}/>*/}
                {/*            <View style={styles.settingText}>*/}
                {/*                <Text style={styles.settingTitle}>Vibration</Text>*/}
                {/*                <Text style={styles.settingDescription}>*/}
                {/*                    Vibrate on notification*/}
                {/*                </Text>*/}
                {/*            </View>*/}
                {/*        </View>*/}
                {/*        <Switch*/}
                {/*            value={vibrationEnabled}*/}
                {/*            onValueChange={setVibrationEnabled}*/}
                {/*            trackColor={{false: '#E5E7EB', true: '#93C5FD'}}*/}
                {/*            thumbColor={vibrationEnabled ? '#3B82F6' : '#F3F4F6'}*/}
                {/*        />*/}
                {/*    </View>*/}
                {/*</View>*/}

                {/*<Text style={styles.sectionTitle}>Notification Types</Text>*/}

                {/*<View style={styles.settingsCard}>*/}
                {/*    <View style={styles.settingRow}>*/}
                {/*        <View style={styles.settingInfo}>*/}
                {/*            <Clock size={20} color="#3B82F6" style={styles.settingIcon}/>*/}
                {/*            <View style={styles.settingText}>*/}
                {/*                <Text style={styles.settingTitle}>Habit Reminders</Text>*/}
                {/*                <Text style={styles.settingDescription}>*/}
                {/*                    Daily reminders for your habits*/}
                {/*                </Text>*/}
                {/*            </View>*/}
                {/*        </View>*/}
                {/*        <Switch*/}
                {/*            value={reminderEnabled}*/}
                {/*            onValueChange={setReminderEnabled}*/}
                {/*            trackColor={{false: '#E5E7EB', true: '#93C5FD'}}*/}
                {/*            thumbColor={reminderEnabled ? '#3B82F6' : '#F3F4F6'}*/}
                {/*        />*/}
                {/*    </View>*/}

                {/*    <View style={styles.divider}/>*/}

                {/*    <View style={styles.settingRow}>*/}
                {/*        <View style={styles.settingInfo}>*/}
                {/*            <Trophy size={20} color="#F59E0B" style={styles.settingIcon}/>*/}
                {/*            <View style={styles.settingText}>*/}
                {/*                <Text style={styles.settingTitle}>Achievements</Text>*/}
                {/*                <Text style={styles.settingDescription}>*/}
                {/*                    Celebrate your milestones*/}
                {/*                </Text>*/}
                {/*            </View>*/}
                {/*        </View>*/}
                {/*        <Switch*/}
                {/*            value={achievementEnabled}*/}
                {/*            onValueChange={setAchievementEnabled}*/}
                {/*            trackColor={{false: '#E5E7EB', true: '#93C5FD'}}*/}
                {/*            thumbColor={achievementEnabled ? '#3B82F6' : '#F3F4F6'}*/}
                {/*        />*/}
                {/*    </View>*/}

                {/*    <View style={styles.divider}/>*/}

                {/*    <View style={styles.settingRow}>*/}
                {/*        <View style={styles.settingInfo}>*/}
                {/*            <Users size={20} color="#EC4899" style={styles.settingIcon}/>*/}
                {/*            <View style={styles.settingText}>*/}
                {/*                <Text style={styles.settingTitle}>Social</Text>*/}
                {/*                <Text style={styles.settingDescription}>*/}
                {/*                    Friend requests and activity*/}
                {/*                </Text>*/}
                {/*            </View>*/}
                {/*        </View>*/}
                {/*        <Switch*/}
                {/*            value={socialEnabled}*/}
                {/*            onValueChange={setSocialEnabled}*/}
                {/*            trackColor={{false: '#E5E7EB', true: '#93C5FD'}}*/}
                {/*            thumbColor={socialEnabled ? '#3B82F6' : '#F3F4F6'}*/}
                {/*        />*/}
                {/*    </View>*/}
                {/*</View>*/}

                <Text style={styles.sectionTitle}>Preview</Text>

                {mockNotifications.map((notification, index) => {
                    const Icon = notification.icon;
                    return (
                        <View key={index} style={styles.notificationCard}>
                            <View style={[styles.notificationIcon, {backgroundColor: notification.bgColor}]}>
                                <Icon size={24} color={notification.color}/>
                            </View>
                            <View style={styles.notificationContent}>
                                <View style={styles.notificationHeader}>
                                    <Text style={styles.notificationTitle}>
                                        {notification.title}
                                    </Text>
                                    <Text style={styles.notificationTime}>
                                        {notification.time}
                                    </Text>
                                </View>
                                <Text style={styles.notificationDescription}>
                                    {notification.description}
                                </Text>
                            </View>
                        </View>
                    );
                })}

                {/* Upcoming Features */}
                <Text style={styles.sectionTitle}>What's Coming</Text>

                {upcomingFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <View key={index} style={styles.featureCard}>
                            <View style={[styles.featureIcon, {backgroundColor: feature.bgColor}]}>
                                <Icon size={24} color={feature.color}/>
                            </View>
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>{feature.title}</Text>
                                <Text style={styles.featureDescription}>
                                    {feature.description}
                                </Text>
                            </View>
                        </View>
                    );
                })}


                {/* Info Card */}
                <View style={styles.infoCard}>
                    <BellOff size={32} color="#6B7280"/>
                    <Text style={styles.infoText}>
                        Notifications are currently disabled. Enable them in settings when available!
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
    settingsCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    settingInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIcon: {
        marginRight: 12,
    },
    settingText: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: 13,
        color: '#6B7280',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 4,
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
    notificationCard: {
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
        opacity: 0.7,
    },
    notificationIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    notificationContent: {
        flex: 1,
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    notificationTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    notificationTime: {
        fontSize: 12,
        color: '#9CA3AF',
        marginLeft: 8,
    },
    notificationDescription: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    infoCard: {
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginTop: 12,
    },
    infoText: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 22,
    },
});