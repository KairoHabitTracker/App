import React, {useState} from 'react';
import {ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {useAuth} from '@/src/contexts/AuthContext';
import {useHabits} from '@/src/contexts/HabitContext';
import {API_BASE} from '@/src/lib/api';
import {errorStyles, oneHabitStyles, sharedFonts, sharedStyles} from "@/global";
import HabitCard from '@/src/components/habit/HabitCard';
import DaySelector from '@/src/components/habit/DaySelector';
import DateTimePickerGroup from '@/src/components/habit/DateTimePickerGroup';
import {useDateTimePickers} from '@/src/hooks/useDateTimePickers';

export default function HabitDetail() {
    const {id} = useLocalSearchParams() as { id: string };
    const {token} = useAuth();
    const {getHabitById} = useHabits();
    const router = useRouter();
    const habit = getHabitById(id);

    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    // zarządza całą logiką pickerów
    const pickerState = useDateTimePickers();

    const toggleDay = (day: string) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const handleSubmit = async () => {
        if (selectedDays.length === 0) {
            Alert.alert('Error', 'Please select at least one day');
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                habit_id: parseInt(id),
                notification_time: pickerState.notificationTime || null,
                days_of_week: selectedDays.length > 0 ? selectedDays : null,
                start_date: pickerState.startDate || null,
                end_date: pickerState.endDate || null
            };

            const response = await fetch(`${API_BASE}/api/habits/user`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            await response.json();

            Alert.alert('Success', 'Habit added to your routine!', [
                {text: 'OK', onPress: () => router.replace('/home')}
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to add habit');
        } finally {
            setSubmitting(false);
        }
    };

    if (!habit) {
        return (
            <View style={errorStyles.container}>
                <Text style={errorStyles.subtitle}>Habit not found</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={sharedStyles.container}>
            <HabitCard habit={habit}/>

            <View style={oneHabitStyles.formSection}>
                <DaySelector selectedDays={selectedDays} onToggleDay={toggleDay}/>
                <DateTimePickerGroup {...pickerState} />

                <TouchableOpacity
                    style={[oneHabitStyles.submitButton, submitting && oneHabitStyles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="#fff"/>
                    ) : (
                        <Text style={sharedFonts.mediumWhiteText}>Add to My Habits</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}