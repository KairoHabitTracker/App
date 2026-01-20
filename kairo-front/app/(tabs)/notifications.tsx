import React, {useState} from 'react';
import {Alert, ScrollView, Text, View} from "react-native";
import {BellOff, Calendar, Clock, Volume2} from '@tamagui/lucide-icons';

import {SettingsRow} from '@/src/components/notifications/SettingsRow';
import {useLocalNotifications} from '@/src/hooks/useLocalNotifications';
import {useHabits} from "@/src/contexts/HabitsContext";
import {notificationStyles} from "@/global";

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
        <View style={notificationStyles.container}>
            <View style={notificationStyles.header}>
                <Text style={notificationStyles.headerTitle}>Notifications</Text>
                <Text style={notificationStyles.headerSubtitle}>
                    Manage your alerts and reminders
                </Text>
            </View>

            <ScrollView contentContainerStyle={notificationStyles.scrollContent}>

                <Text style={notificationStyles.sectionTitle}>General Settings</Text>
                <View style={notificationStyles.settingsCard}>
                    <SettingsRow
                        icon={Clock}
                        title="Habit Reminders"
                        description="Remiders about your habits"
                        value={reminderEnabled}
                        onValueChange={handleToggleReminder}
                    />
                    <View style={notificationStyles.divider}/>
                    <SettingsRow
                        icon={Volume2}
                        title="Sound"
                        description="Sound effects for reminders"
                        value={soundEnabled}
                        onValueChange={setSoundEnabled}
                        color="#10B981"
                    />
                </View>

                <Text style={notificationStyles.sectionTitle}>
                    Active notifications ({scheduledHabits.length})
                </Text>

                {scheduledHabits.length > 0 ? (
                    scheduledHabits.map((habitEntry) => (
                        <View key={habitEntry.id} style={notificationStyles.notificationCard}>
                            <View
                                style={[notificationStyles.notificationIcon, {backgroundColor: habitEntry.habit.hex_color + '20'}]}>
                                <Text style={{fontSize: 24}}>{habitEntry.habit.emoji}</Text>
                            </View>

                            <View style={notificationStyles.notificationContent}>
                                <View style={notificationStyles.notificationHeader}>
                                    <Text style={notificationStyles.notificationTitle}>
                                        {habitEntry.habit.name}
                                    </Text>
                                    <Text style={notificationStyles.notificationTime}>
                                        {habitEntry.notification_time}
                                    </Text>
                                </View>
                                <Text style={notificationStyles.notificationDescription}>
                                    {formatDays(habitEntry.days_of_week)}
                                </Text>
                            </View>

                            <Calendar size={16} color="#9CA3AF" style={{alignSelf: 'center', marginLeft: 10}}/>
                        </View>
                    ))
                ) : (
                    <View style={notificationStyles.infoCard}>
                        <BellOff size={32} color="#6B7280"/>
                        <Text style={notificationStyles.infoText}>
                            You don&#39;t have any active notifications yet.
                        </Text>
                    </View>
                )}

            </ScrollView>
        </View>
    );
}