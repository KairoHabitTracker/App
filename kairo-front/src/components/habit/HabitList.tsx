import AddButton from "@/src/components/AddButton";
import {useMemo, useState} from 'react';
import {RefreshControl, Text, View} from "react-native";
import {ScrollView} from 'react-native-gesture-handler';
import HabitListItem from "./HabitListItem";
import ProgressCard from "@/src/components/habit/ProgressCard";
import {useHabits} from "@/src/contexts/HabitsContext";
import {useAuth} from "@/src/contexts/AuthContext";
import {ThemeColors, useThemeMode} from '@/src/contexts/ThemeContext';
import {useThemedStyles} from '@/src/hooks/useThemedStyles';

export default function HabitList({onAdd, onEditHabit}: any) {
    const {refreshProfile} = useAuth();
    const {
        userHabits,
        fetchUserHabits,
        completeHabit,
        uncompleteHabit,
        loading,
    } = useHabits();

    const [refreshing, setRefreshing] = useState(false);
    const {colors} = useThemeMode();
    const styles = useHabitListStyles();

    const todayName = useMemo(() => {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayIndex = new Date().getDay();
        return days[dayIndex];
    }, []);

    const dailyHabits = useMemo(() => {
        return userHabits.filter(habit => {
            return habit.days_of_week && habit.days_of_week.includes(todayName);
        });
    }, [userHabits, todayName]);

    const handleComplete = async (habitId: number) => {
        await completeHabit(habitId);
        await refreshProfile();
    };

    const handleUncomplete = async (habitId: number) => {
        await uncompleteHabit(habitId);
        await refreshProfile();
    };

    const isToday = (dateString: string | null) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        const now = new Date();
        return (
            date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth() &&
            date.getDate() === now.getDate()
        );
    };

    const completedToday = useMemo(() => {
        return dailyHabits.filter(habit => isToday(habit.last_completed_at));
    }, [dailyHabits]);

    const toBeCompleted = useMemo(() => {
        return dailyHabits.filter(habit => !isToday(habit.last_completed_at));
    }, [dailyHabits]);

    const onRefresh = async () => {
        setRefreshing(true);
        await Promise.all([fetchUserHabits(), refreshProfile()]);
        setRefreshing(false);
    };

    return (
        <View style={styles.screen}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent}/>
                }
            >
                {userHabits.length === 0 && loading && (
                    <Text style={styles.loadingText}> 
                        Loading habits...
                    </Text>
                )}

                {dailyHabits.length > 0 && (
                    <ProgressCard habits={dailyHabits} completedToday={completedToday}/>
                )}

                {toBeCompleted.length > 0 && (
                    <View style={{marginBottom: 24}}>
                        <Text style={styles.sectionLabel}> 
                            To Complete ({toBeCompleted.length})
                        </Text>
                        {toBeCompleted.map(habit => (
                            <HabitListItem
                                key={habit.id}
                                userHabit={habit}
                                onComplete={() => handleComplete(habit.id)}
                                onEditHabit={() => onEditHabit(habit.id)}
                            />
                        ))}
                    </View>
                )}

                {completedToday.length > 0 && (
                    <View style={{marginBottom: 24}}>
                        <Text style={styles.sectionLabel}> 
                            Completed ({completedToday.length})
                        </Text>
                        {completedToday.map(habit => (
                            <HabitListItem
                                key={habit.id}
                                userHabit={habit}
                                isCompleted
                                onUncomplete={() => handleUncomplete(habit.id)}
                            />
                        ))}
                    </View>
                )}

                {!loading && userHabits.length > 0 && dailyHabits.length === 0 && (
                    <View style={styles.centeredState}> 
                        <Text style={styles.emoji}>😴</Text>
                        <Text style={[styles.headline, {marginBottom: 8}]}>Rest Day</Text>
                        <Text style={styles.subtitle}>
                            No habits scheduled for today ({todayName}).
                        </Text>
                    </View>
                )}

                {!loading && userHabits.length === 0 && (
                    <View style={styles.centeredState}> 
                        <Text style={styles.emoji}>👀</Text>
                        <Text style={[styles.headline, {marginBottom: 8}]}>No habits yet</Text>
                        <Text style={styles.subtitle}>
                            Tap the + button below to add your first habit
                        </Text>
                    </View>
                )}
            </ScrollView>

            <View style={styles.addButton}>
                <AddButton onPress={onAdd}/>
            </View>
        </View>
    );
}

const createHabitListStyles = (colors: ThemeColors) => ({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 120,
        gap: 16,
    },
    loadingText: {
        fontSize: 16,
        color: colors.text,
        textAlign: 'center',
        marginTop: 50,
    },
    sectionLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.subtleText,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
        marginLeft: 4,
    },
    centeredState: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        gap: 8,
    },
    emoji: {
        fontSize: 48,
    },
    headline: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: colors.subtleText,
        textAlign: 'center',
        paddingHorizontal: 32,
    },
    addButton: {
        position: 'absolute',
        bottom: 24,
        right: 24,
    },
});

function useHabitListStyles() {
    return useThemedStyles(createHabitListStyles);
}