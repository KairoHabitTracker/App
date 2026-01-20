import AddButton from "@/src/components/AddButton";
import {useMemo, useState} from 'react';
import {RefreshControl, Text, View} from "react-native";
import {ScrollView} from 'react-native-gesture-handler';
import HabitListItem from "./HabitListItem";
import ProgressCard from "@/src/components/habit/ProgressCard";
import {errorStyles, sharedFonts, sharedStyles} from "@/global";
import {useHabits} from "@/src/contexts/HabitsContext";
import {useAuth} from "@/src/contexts/AuthContext";

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
        <View style={sharedStyles.basicContainer}>
            <ScrollView
                contentContainerStyle={sharedStyles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
            >
                {userHabits.length === 0 && loading && (
                    <Text style={[sharedFonts.mediumText, {textAlign: 'center', marginTop: 50}]}>
                        Loading habits...
                    </Text>
                )}

                {dailyHabits.length > 0 && (
                    <ProgressCard habits={dailyHabits} completedToday={completedToday}/>
                )}

                {toBeCompleted.length > 0 && (
                    <View style={{marginBottom: 24}}>
                        <Text style={[sharedFonts.upperCaseSubtleText, {marginBottom: 12, marginLeft: 4}]}>
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
                        <Text style={[sharedFonts.upperCaseSubtleText, {marginBottom: 12, marginLeft: 4}]}>
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
                    <View style={[sharedStyles.center, {paddingVertical: 60}]}>
                        <Text style={sharedFonts.bigEmoji}>😴</Text>
                        <Text style={[errorStyles.title, {marginBottom: 8}]}>Rest Day</Text>
                        <Text style={[errorStyles.subtitle, {paddingHorizontal: 32}]}>
                            No habits scheduled for today ({todayName}).
                        </Text>
                    </View>
                )}

                {!loading && userHabits.length === 0 && (
                    <View style={[sharedStyles.center, {paddingVertical: 60}]}>
                        <Text style={sharedFonts.bigEmoji}>👀</Text>
                        <Text style={[errorStyles.title, {marginBottom: 8}]}>No habits yet</Text>
                        <Text style={[errorStyles.subtitle, {paddingHorizontal: 32}]}>
                            Tap the + button below to add your first habit
                        </Text>
                    </View>
                )}
            </ScrollView>

            <View style={sharedStyles.addButton}>
                <AddButton onPress={onAdd}/>
            </View>
        </View>
    );
}