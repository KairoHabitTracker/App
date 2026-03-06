import React, {useMemo, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {BellOff, Calendar, Clock, Volume2} from '@tamagui/lucide-icons';
import {useHabits} from '@/src/contexts/HabitsContext';
import {useLocalNotifications} from '@/src/hooks/useLocalNotifications';
import {SettingsRow} from '@/src/components/notifications/SettingsRow';
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

export default function NotificationsSettings() {
  const {colors} = useThemeMode();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const {userHabits} = useHabits();
  const {scheduleHabitReminders, cancelAllNotifications} = useLocalNotifications();

  const scheduledHabits = userHabits.filter(
    h => h.notification_time && h.days_of_week && h.days_of_week.length > 0,
  );

  const handleToggleReminder = async (val: boolean) => {
    setReminderEnabled(val);

    if (val) {
      const success = await scheduleHabitReminders(userHabits);
      if (success) {
        Alert.alert('All set!', `Activated ${scheduledHabits.length} habit reminders.`);
      } else {
        setReminderEnabled(false);
      }
    } else {
      await cancelAllNotifications();
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Notifications & Reminders</Text>
        <Text style={styles.subtitle}>
          Additional notifications & reminder settings will be added in future updates!
        </Text>

        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.card}>
          <SettingsRow
            icon={Clock}
            title="Habit reminders"
            description="Send push alerts at the times you set in each habit."
            value={reminderEnabled}
            onValueChange={handleToggleReminder}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon={Volume2}
            title="Sound"
            description="Play a chime so reminders stand out."
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            color="#10B981"
          />
          <View style={styles.divider} />
          <SettingsRow
            icon={BellOff}
            title="Vibration"
            description="Use haptics alongside push alerts."
            value={vibrationEnabled}
            onValueChange={setVibrationEnabled}
            color="#F97316"
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
                <Text style={styles.emoji}>{habitEntry.habit.emoji}</Text>
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
                color={colors.subtleText as any}
                style={{alignSelf: 'center', marginLeft: 10}}
              />
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <BellOff size={32} color={colors.subtleText as any} />
            <Text style={styles.emptyText}>You haven&apos;t scheduled any reminders yet.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 20,
      gap: 16,
      paddingBottom: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
    },
    subtitle: {
      fontSize: 15,
      color: colors.subtleText,
      lineHeight: 22,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.subtleText,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 18,
      gap: 14,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: colors.background === '#0F172A' ? 0.35 : 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
    },
    notificationCard: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 16,
      alignItems: 'center',
      gap: 12,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: colors.background === '#0F172A' ? 0.25 : 0.05,
      shadowRadius: 6,
      elevation: 2,
    },
    notificationIcon: {
      width: 48,
      height: 48,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emoji: {
      fontSize: 24,
    },
    notificationContent: {
      flex: 1,
    },
    notificationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    notificationTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
    },
    notificationTime: {
      fontSize: 14,
      color: colors.subtleText,
    },
    notificationDescription: {
      fontSize: 13,
      color: colors.subtleText,
      marginTop: 4,
    },
    emptyCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: 24,
      alignItems: 'center',
      gap: 12,
    },
    emptyText: {
      fontSize: 14,
      color: colors.subtleText,
      textAlign: 'center',
    },
  });
