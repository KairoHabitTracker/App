import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from "react-native";
import {BellOff, Calendar, Clock, Volume2} from '@tamagui/lucide-icons';

import {SettingsRow} from '@/src/components/notifications/SettingsRow';
import {useLocalNotifications} from '@/src/hooks/useLocalNotifications';
import {useHabits} from "@/src/contexts/HabitsContext";

const formatDays = (days: string[]) => {
    if (!days || days.length === 0) return 'No days selected.';
    if (days.length === 7) return 'Everyday';

    const shortDays: Record<string, string> = {
        monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
        thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun'
    };

    return days.map(d => shortDays[d.toLowerCase()] || d).join(', ');
};

export default function NotificationsScreen() {
    const [reminderEnabled, setReminderEnabled] = useState(false);

    const [soundEnabled, setSoundEnabled] = useState(true);
    const [vibrationEnabled, setVibrationEnabled] = useState(true);

    const {userHabits} = useHabits();
    const {scheduleHabitReminders, cancelAllNotifications} = useLocalNotifications();

    const scheduledHabits = userHabits.filter(
        h => h.notification_time && h.days_of_week && h.days_of_week.length > 0
    );

    const handleToggleReminder = async (val: boolean) => {
        setReminderEnabled(val);

        if (val) {
            const success = await scheduleHabitReminders(userHabits);
            if (success) {
                Alert.alert("Sukces", `Aktywowano ${scheduledHabits.length} przypomnień.`);
            } else {
                setReminderEnabled(false);
            }
        } else {
            await cancelAllNotifications();
        }
    };

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
                        description="Remiders about your habits"
                        value={reminderEnabled}
                        onValueChange={handleToggleReminder}
                    />
                    <View style={styles.divider}/>
                    <SettingsRow
                        icon={Volume2}
                        title="Sound"
                        description="Sound effects for reminders"
                        value={soundEnabled}
                        onValueChange={setSoundEnabled}
                        color="#10B981"
                    />
                </View>

                <Text style={styles.sectionTitle}>
                    Active notifications ({scheduledHabits.length})
                </Text>

                {scheduledHabits.length > 0 ? (
                    scheduledHabits.map((habitEntry) => (
                        <View key={habitEntry.id} style={styles.notificationCard}>
                            <View
                                style={[styles.notificationIcon, {backgroundColor: habitEntry.habit.hex_color + '20'}]}>
                                <Text style={{fontSize: 24}}>{habitEntry.habit.emoji}</Text>
                            </View>

                            <View style={styles.notificationContent}>
                                <View style={styles.notificationHeader}>
                                    <Text style={styles.notificationTitle}>
                                        {habitEntry.habit.name}
                                    </Text>
                                    <Text style={styles.notificationTime}>
                                        {habitEntry.notification_time}
                                    </Text>
                                </View>
                                <Text style={styles.notificationDescription}>
                                    {formatDays(habitEntry.days_of_week)}
                                </Text>
                            </View>

                            <Calendar size={16} color="#9CA3AF" style={{alignSelf: 'center', marginLeft: 10}}/>
                        </View>
                    ))
                ) : (
                    <View style={styles.infoCard}>
                        <BellOff size={32} color="#6B7280"/>
                        <Text style={styles.infoText}>
                            You don&#39;t have any active notifications yet.
                        </Text>
                    </View>
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
        alignItems: 'center',
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
        alignItems: 'center',
        marginBottom: 4,
    },
    notificationTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    notificationTime: {
        fontSize: 14,
        fontWeight: '700',
        color: '#3B82F6',
        marginLeft: 8,
    },
    notificationDescription: {
        fontSize: 13,
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