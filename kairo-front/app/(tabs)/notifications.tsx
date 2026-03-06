import React, {useState} from 'react';
import {Alert, ScrollView, Text, View} from 'react-native';
import {BellOff, Calendar, Clock, Volume2} from '@tamagui/lucide-icons';

import {SettingsRow} from '@/src/components/notifications/SettingsRow';
import {useLocalNotifications} from '@/src/hooks/useLocalNotifications';
import {useHabits} from '@/src/contexts/HabitsContext';
import {useThemedStyles} from '@/src/hooks/useThemedStyles';
import {ThemeColors, useThemeMode} from '@/src/contexts/ThemeContext';

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <Text style={styles.headerSubtitle}>Manage your alerts and reminders</Text>
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
          <View style={styles.divider} />
          <SettingsRow
            icon={Volume2}
            title="Sound"
            description="Sound effects for reminders"
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            color="#10B981"
          />
        </View>

        <Text style={styles.sectionTitle}>Active notifications ({scheduledHabits.length})</Text>

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
                  <Text style={styles.notificationTitle}>{habitEntry.habit.name}</Text>
                  <Text style={styles.notificationTime}>{habitEntry.notification_time}</Text>
                </View>
                <Text style={styles.notificationDescription}>
                  {formatDays(habitEntry.days_of_week)}
                </Text>
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

const createNotificationStyles = (colors: ThemeColors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.subtleText,
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.subtleText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 8,
  },
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
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
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
  notificationTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  notificationTime: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
    marginLeft: 8,
  },
  notificationDescription: {
    fontSize: 13,
    color: colors.subtleText,
    lineHeight: 20,
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