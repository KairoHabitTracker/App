import AddButton from "@/src/components/AddButton";
import {useMemo, useState} from 'react';
import {RefreshControl, ScrollView, Text, View} from "react-native";
import HabitListItem from "./HabitListItem";
import ProgressCard from "@/src/components/habit/ProgressCard";
import {errorStyles, sharedFonts, sharedStyles} from "@/global";
import {useHabits} from "@/src/contexts/HabitsContext";


export default function HabitList({onAdd, onEditHabit}: any) {

    const {
        userHabits,         // lista nawyków użytkownika
        fetchUserHabits,    // odświeżanie listy
        completeHabit,
        uncompleteHabit,
        loading,
    } = useHabits();

    const [refreshing, setRefreshing] = useState(false);

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
        return userHabits.filter(habit => isToday(habit.last_completed_at));
    }, [userHabits]);

    const toBeCompleted = useMemo(() => {
        return userHabits.filter(habit => !isToday(habit.last_completed_at));
    }, [userHabits]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUserHabits();
        setRefreshing(false);
    };

    const habitsToDisplay = userHabits;

    return (
        <View style={sharedStyles.basicContainer}>
            <ScrollView
                contentContainerStyle={sharedStyles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
            >
                {habitsToDisplay.length === 0 && loading && (
                    <Text style={[sharedFonts.mediumText, {textAlign: 'center', marginTop: 50}]}>Loading
                        habits...</Text>
                )}

                {habitsToDisplay.length > 0 && (
                    <ProgressCard habits={habitsToDisplay} completedToday={completedToday}/>
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
                                onComplete={() => completeHabit(habit.id)}
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
                                onUncomplete={() => uncompleteHabit(habit.id)}
                            />
                        ))}
                    </View>
                )}

                {habitsToDisplay.length === 0 && !loading && (
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