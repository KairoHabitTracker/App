import {StyleSheet, Text, View} from 'react-native';
import HabitList from '@/src/components/habit/HabitList';
import {useRouter} from 'expo-router';
import {useAuth} from '@/src/contexts/AuthContext';
import {Flame} from '@tamagui/lucide-icons';
import {ThemeColors, useThemeMode} from '@/src/contexts/ThemeContext';
import {useThemedStyles} from '@/src/hooks/useThemedStyles';

export default function Home() {
  const router = useRouter();
  const {user} = useAuth();
  const {colors} = useThemeMode();
  const styles = useHomeStyles();

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Today</Text>
          <Text style={styles.headerSubtitle}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        <View style={styles.streakBadge}>
          <Flame size={18} color={colors.warning} fill={colors.warning} />
          <Text style={styles.streakText}>{user?.streak ?? 0}</Text>
        </View>
      </View>
      <HabitList
        onAdd={() => router.push('/habit/add')}
        onEditHabit={(userHabitId: number) => {
          console.log(userHabitId);
          router.push(`/habit/edit/${userHabitId}`);
        }}
      />
    </View>
  );
}

const createHomeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 64,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 24,
      paddingHorizontal: 20,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 16,
      color: colors.subtleText,
      fontWeight: '500',
    },
    streakBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.warningBackground,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.warning,
      gap: 4,
    },
    streakText: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.warning,
    },
  });

const useHomeStyles = () => useThemedStyles(createHomeStyles);
