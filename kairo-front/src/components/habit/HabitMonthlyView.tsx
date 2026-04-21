import React, {useMemo, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, Text, View} from 'react-native';
import {ChevronLeft, ChevronRight} from '@tamagui/lucide-icons';
import {useHabits} from '@/src/contexts/HabitsContext';
import {useAuth} from '@/src/contexts/AuthContext';
import {ThemeColors, useThemeMode} from '@/src/contexts/ThemeContext';
import {useThemedStyles} from '@/src/hooks/useThemedStyles';
import AddButton from "@/src/components/AddButton";

interface HabitMonthlyViewProps {
  onAdd: () => void;
  onEditHabit: (userHabitId: number) => void;
}

export default function HabitMonthlyView({onAdd, onEditHabit}: HabitMonthlyViewProps) {
  const {userHabits, fetchUserHabits} = useHabits();
  const {refreshProfile} = useAuth();
  const {colors} = useThemeMode();
  const styles = useHabitMonthlyViewStyles();
  const [refreshing, setRefreshing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchUserHabits(), refreshProfile()]);
    setRefreshing(false);
  };

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysCount = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Puste dni na początku
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Dni miesiąca
    for (let i = 1; i <= daysCount; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }, [currentDate]);


  const isHabitCompletedOnDay = (userHabitId: number, date: Date | null) => {
    if (!date) return false;
    const userHabit = userHabits.find(h => h.id === userHabitId);
    if (!userHabit?.last_completed_at) return false;

    const lastCompleted = new Date(userHabit.last_completed_at);
    return (
      lastCompleted.getFullYear() === date.getFullYear() &&
      lastCompleted.getMonth() === date.getMonth() &&
      lastCompleted.getDate() === date.getDate()
    );
  };

  const shouldHabitBeOnDay = (userHabit: any, date: Date | null) => {
    if (!date) return false;
    const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
      date.getDay()
      ];
    return userHabit.days_of_week?.includes(dayName);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthName = currentDate.toLocaleDateString('en-US', {month: 'long', year: 'numeric'});

  return (
    <View style={styles.screen}>
      {/* Month Navigation */}
      <View style={[styles.monthHeader, {backgroundColor: colors.card}]}>
        <Pressable onPress={prevMonth} style={styles.navButton}>
          <ChevronLeft size={24} color={colors.text}/>
        </Pressable>
        <Text style={styles.monthTitle}>{monthName}</Text>
        <Pressable onPress={nextMonth} style={styles.navButton}>
          <ChevronRight size={24} color={colors.text}/>
        </Pressable>
      </View>

      {/* Day names header */}
      <View style={[styles.weekdaysHeader, {backgroundColor: colors.card}]}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <View key={day} style={styles.weekdayLabel}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent}/>}
      >
        {/* Calendar Grid */}
        <View style={styles.calendarContainer}>
          {daysInMonth.map((date, index) => {
            const habitsForDay = date
              ? userHabits.filter(habit => shouldHabitBeOnDay(habit, date))
              : [];

            // Sprawdź czy wszystkie habitów na ten dzień są ukończone
            const allHabitsCompleted = habitsForDay.length > 0 && habitsForDay.every(habit => isHabitCompletedOnDay(habit.id, date));

            return (
              <View key={index} style={[
                styles.dayCell,
                {
                  borderColor: colors.border,
                  backgroundColor: allHabitsCompleted ? colors.accent : colors.card,
                }
              ]}>
                {date ? (
                  <>
                    <Text
                      style={[styles.dayNumber, {color: allHabitsCompleted ? colors.card : colors.text}]}>{date.getDate()}</Text>
                    <View style={styles.habitsContainer}>
                      {habitsForDay.slice(0, 3).map(habit => {
                        const isCompleted = isHabitCompletedOnDay(habit.id, date);
                        return (
                          <Pressable
                            key={habit.id}
                            onPress={() => onEditHabit(habit.id)}
                            style={[
                              styles.habitDot,
                              {
                                backgroundColor: isCompleted ? habit.habit.hex_color : colors.border,
                              },
                            ]}
                          >
                            <Text style={styles.habitEmoji}>{habit.habit.emoji}</Text>
                          </Pressable>
                        );
                      })}
                      {habitsForDay.length > 3 && (
                        <Text
                          style={[styles.moreHabits, {color: allHabitsCompleted ? colors.card : colors.subtleText}]}>
                          +{habitsForDay.length - 3}
                        </Text>
                      )}
                    </View>
                  </>
                ) : null}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.addButton}>
        <AddButton onPress={onAdd}/>
      </View>
    </View>
  );
}

const createHabitMonthlyViewStyles = (colors: ThemeColors) => ({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  navButton: {
    padding: 8,
  },
  weekdaysHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  weekdayLabel: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.subtleText,
  },
  scrollContent: {
    padding: 8,
    paddingBottom: 120,
  },
  calendarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    justifyContent: 'flex-start',
    backgroundColor: colors.card,
  },
  dayNumber: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  habitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  habitDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  habitEmoji: {
    fontSize: 10,
  },
  moreHabits: {
    fontSize: 8,
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
});

function useHabitMonthlyViewStyles() {
  return useThemedStyles(createHabitMonthlyViewStyles);
}



