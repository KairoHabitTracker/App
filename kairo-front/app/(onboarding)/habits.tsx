import React, {useState} from 'react';
import {ActivityIndicator, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';
import {spacing, useScreenStyles} from '@/src/styles/screenStyles';
import {useThemeMode} from '@/src/contexts/ThemeContext';

const HABITS = [
  {id: 'exercise', label: 'Exercise regularly', emoji: '🏃'},
  {id: 'read', label: 'Read daily', emoji: '📖'},
  {id: 'meditate', label: 'Meditate', emoji: '🧘'},
  {id: 'water', label: 'Drink more water', emoji: '💧'},
  {id: 'sleep', label: 'Better sleep schedule', emoji: '😴'},
  {id: 'journal', label: 'Journal writing', emoji: '📝'},
];


export default function HabitsScreen() {
  const styles = useScreenStyles();
  const {colors} = useThemeMode();
  const {name, age, interests} = useLocalSearchParams<{ name: string; age: string; interests: string }>();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleHabit = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleNext = async () => {
    if (loading || selected.length === 0) return;

    setLoading(true);
    try {
      router.push({
        pathname: '/(onboarding)/loading',
        params: {name, age, interests, habits: selected.join(',')},
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} style={{paddingHorizontal: spacing.xl, paddingTop: spacing.xl}}>
          <Text style={[styles.link, {marginTop: 0}]}>← Back</Text>
        </TouchableOpacity>

        <View style={{paddingHorizontal: spacing.xl, paddingVertical: spacing.lg}}>
          <Text style={styles.screenTitle}>Choose your first habits</Text>
          <Text style={[styles.headerSubtitle, {marginTop: spacing.md, marginBottom: spacing.xxl}]}>
            Placeholder - habits feature coming soon
          </Text>

          <View style={{gap: spacing.md}}>
            {HABITS.map(habit => (
              <TouchableOpacity
                key={habit.id}
                style={[
                  styles.row,
                  {
                    backgroundColor: selected.includes(habit.id)
                      ? colors.accent
                      : colors.card,
                    borderWidth: selected.includes(habit.id) ? 0 : 1,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => toggleHabit(habit.id)}
                activeOpacity={0.7}
              >
                <Text style={{fontSize: 24, marginRight: spacing.md}}>{habit.emoji}</Text>
                <Text
                  style={[
                    styles.itemTitle,
                    {
                      color: selected.includes(habit.id)
                        ? colors.card
                        : colors.text,
                    },
                  ]}
                >
                  {habit.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={{paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, gap: spacing.md}}>
        <Text style={[styles.itemSubtext, {textAlign: 'center'}]}>
          Selected: {selected.length}
        </Text>
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: selected.length === 0
                ? colors.mutedAccent
                : colors.accent,
              marginHorizontal: 0,
              marginBottom: 0,
            },
          ]}
          onPress={handleNext}
          disabled={selected.length === 0 || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={colors.card}/>
          ) : (
            <Text
              style={[
                styles.primaryButtonText,
                {
                  color: selected.length === 0 ? colors.text : colors.card,
                  textAlign: 'center',
                },
              ]}
            >
              Next
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
