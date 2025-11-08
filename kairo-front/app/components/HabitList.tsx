import {ScrollView, StyleSheet, Text, View} from "react-native";
import {useEffect, useState} from 'react';
import HabitListItem from "./HabitListItem";
import AddButton from "@/src/components/AddButton";
import type {UserHabit} from '@/src/types/UserHabit';
import {useAuth} from "@/src/contexts/AuthContext";


export default function HabitList({onAdd}: any) {
    const {token} = useAuth();

    const [habits, setHabits] = useState<UserHabit[]>([]);

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

    const completedToday = habits ? habits.filter(habit => isToday(habit.last_completed_at)) : [];
    const toBeCompleted = habits ? habits.filter(habit => !isToday(habit.last_completed_at)) : [];

    useEffect(() => {
        if (token) {
            getHabits().then(r => setHabits(r));
        }
    }, [token]);

    const getHabits = async () => {
        try {
            const response = await fetch('https://kairo.iru.codes/api/habits/user', {
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
    }

    const toggleHabit = (index: number, checked: boolean) => {
        const newHabits = habits.map(h =>
            h.id === index ? {...h, done: checked} : h
        );
        setHabits(newHabits);
    };


    return (
        <View style={styles.main}>
            <ScrollView>
                {toBeCompleted.map(habit => (
                    <HabitListItem key={habit.id} habit={habit} showCheckbox={true} color={'#ffbc6b'}
                                   onToggle={(checked) => toggleHabit(habit.id, checked)}/>
                ))}
                {completedToday.length > 0 && (
                    <>
                        <Text style={{marginTop: 20}}>Completed</Text>
                        {completedToday.map(habit => (
                            <HabitListItem key={habit.id} habit={habit} showCheckbox={false} color={'#ffbc6b'}/>
                        ))}
                    </>
                )}

            </ScrollView>
            <View style={styles.addButton}>
                <AddButton onPress={onAdd}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        flexDirection: 'column',
        flex: 1
    },
    addButton: {
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 35
    }
});
