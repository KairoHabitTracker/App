import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {BellOff, Calendar, Clock, Volume2} from '@tamagui/lucide-icons';

import {SettingsRow} from '@/src/components/notifications/SettingsRow';
import {useLocalNotifications} from '@/src/hooks/useLocalNotifications';
import {useHabits} from '@/src/contexts/HabitsContext';
import {useScreenStyles} from '@/src/styles/screenStyles';
import {ThemeColors, useThemeMode} from '@/src/contexts/ThemeContext';
import {useThemedStyles} from '@/src/hooks/useThemedStyles';

const formatDays = (days: string[]) => {
  if (!days || days.length === 0) return 'No days selected.';
  if (days.length === 7) return 'Everyday';

  const shortDays: Record<string, string> = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
  };

  return days.map(d => shortDays[d.toLowerCase()] || d).join(', ');
};

export default function NotificationsScreen() {
  const [reminderEnabled, setReminderEnabled] = useState(false);

  const [soundEnabled, setSoundEnabled] = useState(true);
  // const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const {userHabits} = useHabits();
  const {scheduleHabitReminders, cancelAllNotifications} = useLocalNotifications();
  const {colors} = useThemeMode();
  const s = useScreenStyles();
  const styles = useNotificationStyles();

  const scheduledHabits = userHabits.filter(
    h => h.notification_time && h.days_of_week && h.days_of_week.length > 0,
  );

  const handleToggleReminder = async (val: boolean) => {
    setReminderEnabled(val);

    if (val) {
      const success = await scheduleHabitReminders(userHabits);
      if (success) {
        Alert.alert('Sukces', `Aktywowano ${scheduledHabits.length} przypomnień.`);
      } else {
        setReminderEnabled(false);
      }
    } else {
      await cancelAllNotifications();
    }
  };

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Notifications</Text>
        <Text style={s.headerSubtitle}>Manage your alerts and reminders</Text>
      </View>

      <ScrollView contentContainerStyle={s.scrollContent}>
        <Text style={[s.sectionTitle, {marginTop: 8}]}>General Settings</Text>
        <View style={styles.settingsCard}>
          <SettingsRow
            icon={Clock}
            title="Habit Reminders"
            description="Remiders about your habits"
            value={reminderEnabled}
            onValueChange={handleToggleReminder}
          />
          <View style={s.divider} />
          <SettingsRow
            icon={Volume2}
            title="Sound"
            description="Sound effects for reminders"
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            color="#10B981"
          />
        </View>

        <Text style={[s.sectionTitle, {marginTop: 8}]}>
          Active notifications ({scheduledHabits.length})
        </Text>

        {scheduledHabits.length > 0 ? (
          scheduledHabits.map(habitEntry => (
            <View key={habitEntry.id} style={styles.notificationCard}>
              <View
                style={[
                  styles.notificationIcon,
                  {backgroundColor: habitEntry.habit.hex_color + '20'},
                ]}>
                <Text style={{fontSize: 24}}>{habitEntry.habit.emoji}</Text>
              </View>

              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text style={s.itemTitle}>{habitEntry.habit.name}</Text>
                  <Text style={styles.notificationTime}>{habitEntry.notification_time}</Text>
                </View>
                <Text style={s.itemSubtext}>{formatDays(habitEntry.days_of_week)}</Text>
              </View>

              <Calendar
                size={16}
                color={colors.subtleText as string}
                style={{alignSelf: 'center', marginLeft: 10}}
              />
            </View>
          ))
        ) : (
          <View style={styles.infoCard}>
            <BellOff size={32} color={colors.subtleText as string} />
            <Text style={styles.infoText}>You don&#39;t have any active notifications yet.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const createNotificationStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    settingsCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    notificationCard: {
      flexDirection: 'row',
      backgroundColor: colors.card,
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
      backgroundColor: colors.surface,
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
    notificationTime: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.accent,
      marginLeft: 8,
    },
    infoCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      marginTop: 12,
    },
    infoText: {
      fontSize: 15,
      color: colors.subtleText,
      textAlign: 'center',
      marginTop: 12,
      lineHeight: 22,
    },
  });

const useNotificationStyles = () => useThemedStyles(createNotificationStyles);
