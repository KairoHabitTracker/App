import {ScrollView, Text, View} from 'react-native';
import {useAuth} from "@/src/contexts/AuthContext";
import {useEffect, useState} from "react";
import {Habit} from "@/app/types/Habit";

export default function AddHabit() {
    const {token} = useAuth();
    const [habits, setHabits] = useState<Habit[]>([]);

    useEffect(() => {
        if (token) {
            getPredefinedHabits().then(r => {
                setHabits(r);
            });
        }
    }, [token]);

    useEffect(() => {
        console.log('Habits state updated:', habits);
    }, [habits]);

    const getPredefinedHabits = async () => {
        try {
            const response = await fetch('https://kairo.iru.codes/api/habits', {
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
    return (
        <ScrollView>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', margin: 10}}>
                <View>
                    <Text>ikona</Text>
                </View>
                <View>
                    <Text>Nazwa</Text>
                </View>
                <View style={{display: 'flex', flexDirection: 'row', gap: 2, flexWrap: 'wrap'}}>
                    {habits.map(habit => (
                        <View key={habit.id} style={{backgroundColor: habit.hex_color, padding: 6, borderRadius: 20}}>
                            <View style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row'
                            }}>
                                <Text>{habit.emoji}</Text>
                                <Text>{habit.name}</Text>
                            </View>
                        </View>
                    ))}
                </View>
                <View>
                    <Text>Powiadomienia?</Text>
                </View>
            </View>
        </ScrollView>

    );
}