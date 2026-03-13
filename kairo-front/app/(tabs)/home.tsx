import {Text, View} from 'react-native';
import HabitList from '@/src/components/habit/HabitList';
import {useRouter} from 'expo-router';
import {useAuth} from '@/src/contexts/AuthContext';
import {Flame} from '@tamagui/lucide-icons';
import {useThemeMode} from '@/src/contexts/ThemeContext';
import {useScreenStyles} from '@/src/styles/screenStyles';

export default function Home() {
  const router = useRouter();
  const {user} = useAuth();
  const {colors} = useThemeMode();
  const s = useScreenStyles();

  return (
    <View style={[s.screen, {paddingTop: 64}]}>
      <View style={s.headerRow}>
        <View>
          <Text style={s.headerTitle}>Today</Text>
          <Text style={[s.headerSubtitle, {fontSize: 16, fontWeight: '500'}]}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        <View
          style={[
            s.badge,
            {backgroundColor: colors.warningBackground, borderColor: colors.warning},
          ]}>
          <Flame size={18} color={colors.warning} fill={colors.warning} />
          <Text style={{fontSize: 15, fontWeight: '700', color: colors.warning}}>
            {user?.streak ?? 0}
          </Text>
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
