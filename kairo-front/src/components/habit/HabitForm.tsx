import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useRouter} from 'expo-router';
import {useHabits} from '@/src/contexts/HabitsContext';
import {errorStyles, oneHabitStyles, sharedFonts, sharedStyles} from "@/global";
import HabitCard from '@/src/components/habit/HabitCard';
import DaySelector from '@/src/components/habit/DaySelector';
import DateTimePickerGroup from '@/src/components/habit/DateTimePickerGroup';
import {useDateTimePickers} from '@/src/hooks/useDateTimePickers';
import {Habit} from "@/src/types/Habit";

interface HabitFormProps {
    mode: 'add' | 'edit';
    habitId?: string; // tylko dla add
    userHabitId?: string; // tylko dla edit
}

export default function HabitForm({mode, habitId, userHabitId}: HabitFormProps) {
    const {getHabitById, getUserHabitById, addHabit, editHabit} = useHabits();
    const router = useRouter();

    const [loadingInitialData, setLoadingInitialData] = useState(true);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const pickerState = useDateTimePickers();

    const predefinedHabit = habitId ? getHabitById(habitId) : undefined;
    const userHabitDetails = userHabitId ? getUserHabitById(userHabitId) : undefined;
    const habitToDisplay: Habit | undefined = predefinedHabit || userHabitDetails?.habit;

    useEffect(() => {

        if (mode === 'edit' && userHabitDetails) {
            setSelectedDays(userHabitDetails.days_of_week || []);
            pickerState.initialize({
                notificationTime: userHabitDetails.notification_time,
                startDate: userHabitDetails.start_date,
                endDate: userHabitDetails.end_date,
            });
            setLoadingInitialData(false);

        } else if (mode === 'add' && predefinedHabit) {
            setSelectedDays([]);
            pickerState.initialize({});
            setLoadingInitialData(false);

        } else {
            setLoadingInitialData(false);
        }
    }, [mode, userHabitDetails, predefinedHabit]);

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
                ...(mode === 'add' && {habit_id: parseInt(habitId!)}),

                notification_time: pickerState.notificationTime || null,
                days_of_week: selectedDays,
                start_date: pickerState.startDate || null,
                end_date: pickerState.endDate || null
            };

            if (mode === 'edit') {
                await editHabit(userHabitId!, payload);
            } else {
                await addHabit(payload);
            }

            const successMessage = mode === 'edit' ? 'Habit updated successfully!' : 'Habit added to your routine!';
            Alert.alert('Success', successMessage, [
                {text: 'OK', onPress: () => router.replace('/home')}
            ]);
        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', `Failed to ${mode} habit: ${error.message || 'Check logs'}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingInitialData) {
        return (
            <View style={errorStyles.container}>
                <ActivityIndicator color="#000" size="large"/>
                <Text style={errorStyles.subtitle}>Loading habit details...</Text>
            </View>
        );
    }

    if (!habitToDisplay) {
        const errorText = mode === 'edit'
            ? `User Habit ID ${userHabitId} not found.`
            : `Habit ID ${habitId} not found in catalog.`;
        return (
            <View style={errorStyles.container}>
                <Text style={errorStyles.subtitle}>{errorText}</Text>
            </View>
        );
    }

    const buttonText = mode === 'edit' ? 'Save Changes' : 'Add to My Habits';

    return (
        <ScrollView contentContainerStyle={sharedStyles.container}>
            <HabitCard habit={habitToDisplay}/>

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
                        <Text style={sharedFonts.mediumWhiteText}>{buttonText}</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}