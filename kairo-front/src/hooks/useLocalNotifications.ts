import {useState} from 'react';
import {Alert, Platform} from 'react-native';
import * as Notifications from 'expo-notifications';

// Mapa dni tygodnia z API na format Expo (1 = Niedziela, 2 = Poniedziałek...)
const DAYS_MAP: Record<string, number> = {
  sunday: 1,
  monday: 2,
  tuesday: 3,
  wednesday: 4,
  thursday: 5,
  friday: 6,
  saturday: 7,
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const initializeAndroidNotificationChannels = async () => {
  if (Platform.OS === 'android') {
    try {

      await Notifications.setNotificationChannelAsync('habit-reminders', {
        name: 'Habit Reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#F97316',
        bypassDnd: false,
        sound: 'default',
      });

      console.log('Android notification channels initialized successfully.');
    } catch (error) {
      console.warn('Failed to set up Android notification channels:', error);
    }
  }
};

export const useLocalNotifications = () => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  const requestPermissions = async () => {
    const {status: existingStatus} = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const {status} = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Brak uprawnień', 'Włącz powiadomienia w ustawieniach.');
      return false;
    }
    setPermissionsGranted(true);

    if (Platform.OS === 'android') {
      await initializeAndroidNotificationChannels();
    }

    return true;
  };

  const scheduleHabitReminders = async (habits: any[]) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return false;

    await Notifications.cancelAllScheduledNotificationsAsync();

    console.log("Rozpoczynam planowanie powiadomień dla", habits.length, "nawyków");

    for (const habitEntry of habits) {
      if (!habitEntry.notification_time) continue;

      const [hourStr, minuteStr] = habitEntry.notification_time.split(':');
      const hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);

      for (const dayName of habitEntry.days_of_week) {
        const expoDay = DAYS_MAP[dayName.toLowerCase()];

        if (!expoDay) continue;

        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Czas na nawyk: ${habitEntry.habit.name} ${habitEntry.habit.emoji}`,
            body: "To Twój czas na realizację celu! 💪",
            sound: true,
            data: {habitId: habitEntry.id},
            ...(Platform.OS === 'android' && {
              channelId: 'habit-reminders',
              lightColor: habitEntry.habit.hex_color || '#F97316',
              vibratePattern: [0, 250, 250, 250],
              priority: 'high',
            }),
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            weekday: expoDay,
            hour: hour,
            minute: minute,
            repeats: true,
          },
        });
      }
    }

    console.log("Zakończono planowanie powiadomień.");
    return true;
  };

  const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("Wszystkie powiadomienia anulowane.");
  };

  return {
    scheduleHabitReminders,
    cancelAllNotifications,
    permissionsGranted,
    initializeAndroidNotificationChannels,
  };
};
