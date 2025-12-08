import AddButton from "@/src/components/AddButton";
import {useAuth} from "@/src/contexts/AuthContext";
import {API_BASE} from '@/src/lib/api';
import type {UserHabit} from '@/src/types/UserHabit';
import {useEffect, useState} from 'react';
import {RefreshControl, ScrollView, Text, View} from "react-native";
import HabitListItem from "./HabitListItem";
import ProgressCard from "@/src/components/habit/ProgressCard";
import {errorStyles, sharedFonts, sharedStyles} from "@/global";

export default function HabitList({onAdd, onEditHabit}: any) {
    const {token} = useAuth();
    const [habits, setHabits] = useState<UserHabit[]>([]);
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

    const completedToday = habits.filter(habit => isToday(habit.last_completed_at));
    const toBeCompleted = habits.filter(habit => !isToday(habit.last_completed_at));

    useEffect(() => {
        if (token) {
            loadHabits();
        }
    }, [token]);

    const loadHabits = async () => {
        const data = await getHabits();
        setHabits(data);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadHabits();
        setRefreshing(false);
    };

    const getHabits = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/habits/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const json = await response.json();
            const data = json.data;
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const completeHabit = async (habitId: number) => {
        try {
            await fetch(`${API_BASE}/api/habits/user/${habitId}/complete`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            await loadHabits();
        } catch (error) {
            console.error('Error completing habit:', error);
        }
    };

    const uncompleteHabit = async (habitId: number) => {
        try {
            await fetch(`${API_BASE}/api/habits/user/${habitId}/uncomplete`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            await loadHabits();
        } catch (error) {
            console.error('Error uncompleting habit:', error);
        }
    };


    return (
        <View style={sharedStyles.basicContainer}>
            <ScrollView
                contentContainerStyle={sharedStyles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
            >
                {habits.length > 0 && (
                    <ProgressCard habits={habits} completedToday={completedToday}/>
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

                {habits.length === 0 && (
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
