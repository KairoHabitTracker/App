import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from "react-native";
import {Bell, Clock, MessageSquare, Smartphone, Trophy, Users, Volume2} from '@tamagui/lucide-icons';

import {SettingsRow} from '@/src/components/notifications/SettingsRow';
import {useLocalNotifications} from '@/src/hooks/useLocalNotifications';
import {useHabits} from "@/src/contexts/HabitsContext";

export default function NotificationsScreen() {
    const [reminderEnabled, setReminderEnabled] = useState(false);

    //na razie tylko wizualne - czekam na endpointy
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [vibrationEnabled, setVibrationEnabled] = useState(true);
    const [socialEnabled, setSocialEnabled] = useState(false);

    const {userHabits} = useHabits();
    const {scheduleHabitReminders, cancelAllNotifications} = useLocalNotifications();

    // Główna funkcja sterująca powiadomieniami o nawykach
    const handleToggleReminder = async (val: boolean) => {
        setReminderEnabled(val);

        if (val) {
            const success = await scheduleHabitReminders(userHabits);
            if (success) {
                Alert.alert("Sukces", `Zaplanowano powiadomienia dla ${userHabits.length} nawyków.`);
            } else {
                setReminderEnabled(false);
            }
        } else {
            await cancelAllNotifications();
        }
    };

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
    ];

    const upcomingFeatures = [
        {
            icon: Users,
            color: '#EC4899',
            bgColor: '#FCE7F3',
            title: 'Friend Activity',
            description: 'See when friends complete habits',
        },
        {
            icon: MessageSquare,
            color: '#8B5CF6',
            bgColor: '#EDE9FE',
            title: 'Motivational Messages',
            description: 'Daily encouragement to keep you on track',
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notifications</Text>
                <Text style={styles.headerSubtitle}>
                    Manage your alerts and reminders
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                <Text style={styles.sectionTitle}>General Settings</Text>
                <View style={styles.settingsCard}>

                    <SettingsRow
                        icon={Clock}
                        title="Habit Reminders"
                        description="Powiadomienia o Twoich nawykach"
                        value={reminderEnabled}
                        onValueChange={handleToggleReminder}
                    />

                    <View style={styles.divider}/>

                    {/*  tylko w UI na razie */}
                    <SettingsRow
                        icon={Volume2}
                        title="Sound"
                        description="Dźwięk przy powiadomieniu"
                        value={soundEnabled}
                        onValueChange={setSoundEnabled}
                        color="#10B981"
                    />

                    <View style={styles.divider}/>

                    <SettingsRow
                        icon={Smartphone}
                        title="Vibration"
                        description="Wibracje przy powiadomieniu"
                        value={vibrationEnabled}
                        onValueChange={setVibrationEnabled}
                        color="#F59E0B"
                    />
                </View>

                {/*Placeholder */}
                <Text style={styles.sectionTitle}>Social & Updates</Text>
                <View style={styles.settingsCard}>
                    <SettingsRow
                        icon={Users}
                        title="Social Activity"
                        description="Zaproszenia od znajomych (Coming Soon)"
                        value={socialEnabled}
                        onValueChange={(val) => {
                            setSocialEnabled(val);
                            if (val) Alert.alert("Coming Soon", "Ta funkcja będzie dostępna wkrótce!");
                        }}
                        color="#EC4899"
                    />
                </View>

                <Text style={styles.sectionTitle}>Recent Activity</Text>
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

                <Text style={styles.sectionTitle}>Coming Soon</Text>
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
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 4,
    },
    // Style dla kart funkcji i powiadomień
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
});