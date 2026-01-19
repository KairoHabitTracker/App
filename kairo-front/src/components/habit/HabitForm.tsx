import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import {useRouter} from 'expo-router';
import {useHabits} from '@/src/contexts/HabitsContext';
import {errorStyles, oneHabitStyles, sharedFonts, sharedStyles} from "@/global";
import HabitCard from '@/src/components/habit/HabitCard';
import DaySelector from '@/src/components/habit/DaySelector';
import DateTimePickerGroup from '@/src/components/habit/DateTimePickerGroup';
import {useDateTimePickers} from '@/src/hooks/useDateTimePickers';
import {Habit} from "@/src/types/habits/Habit";

interface HabitFormProps {
    mode: 'add' | 'edit';
    habitId?: string;
    userHabitId?: string;
}

export default function HabitForm({mode, habitId, userHabitId}: HabitFormProps) {
    const {getHabitById, getUserHabitById, addHabit, editHabit} = useHabits();
    const router = useRouter();

    const [loadingInitialData, setLoadingInitialData] = useState(true);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);

    const [enableNotifications, setEnableNotifications] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const pickerState = useDateTimePickers();

    const predefinedHabit = habitId ? getHabitById(habitId) : undefined;
    const userHabitDetails = userHabitId ? getUserHabitById(userHabitId) : undefined;
    const habitToDisplay: Habit | undefined = predefinedHabit || userHabitDetails?.habit;

    const habitColor = habitToDisplay?.hex_color || '#3B82F6';

    useEffect(() => {
        if (mode === 'edit' && userHabitDetails) {
            setSelectedDays(userHabitDetails.days_of_week || []);

            const hasNotification = !!userHabitDetails.notification_time;
            setEnableNotifications(hasNotification);

            pickerState.initialize({
                notificationTime: userHabitDetails.notification_time,
                startDate: userHabitDetails.start_date,
                endDate: userHabitDetails.end_date,
            });
            setLoadingInitialData(false);

        } else if (mode === 'add' && predefinedHabit) {
            setSelectedDays([]);
            setEnableNotifications(false);
            pickerState.initialize({});
            setLoadingInitialData(false);

        } else {
            setLoadingInitialData(false);
        }
    }, [mode, userHabitDetails, predefinedHabit, pickerState]);

    const toggleDay = (day: string) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const toggleAllDays = () => {
        if (selectedDays.length === 7) {
            setSelectedDays([]);
        } else {
            setSelectedDays(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
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

                notification_time: enableNotifications ? pickerState.notificationTime : null,
                days_of_week: selectedDays,
                start_date: enableNotifications ? pickerState.startDate : null,
                end_date: enableNotifications ? pickerState.endDate : null
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
                <ActivityIndicator color={habitColor} size="large"/>
                <Text style={errorStyles.subtitle}>Loading habit details...</Text>
            </View>
        );
    }

    if (!habitToDisplay) {
        return (
            <View style={errorStyles.container}>
                <Text style={errorStyles.subtitle}>Habit not found.</Text>
            </View>
        );
    }

    const buttonText = mode === 'edit' ? 'Save Changes' : 'Add to My Habits';

    return (
        <ScrollView contentContainerStyle={sharedStyles.container}>
            <HabitCard habit={habitToDisplay}/>

            <View style={oneHabitStyles.formSection}>
                <DaySelector
                    selectedDays={selectedDays}
                    onToggleDay={toggleDay}
                    onToggleAll={toggleAllDays}
                    activeColor={habitColor}
                />

                <View style={styles.reminderHeader}>
                    <Text style={styles.label}>Reminders & Dates</Text>
                    <Switch
                        value={enableNotifications}
                        onValueChange={setEnableNotifications}
                        trackColor={{false: '#E5E7EB', true: habitColor + '80'}}
                        thumbColor={enableNotifications ? habitColor : '#f4f3f4'}
                    />
                </View>

                {enableNotifications && (
                    <View style={styles.remindersContainer}>
                        <DateTimePickerGroup {...pickerState} />
                    </View>
                )}

                <TouchableOpacity
                    style={[
                        oneHabitStyles.submitButton,
                        {backgroundColor: habitColor},
                        submitting && oneHabitStyles.submitButtonDisabled
                    ]}
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

const styles = StyleSheet.create({
    reminderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        marginTop: 10
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151'
    },
    remindersContainer: {
        marginBottom: 20
    },
});