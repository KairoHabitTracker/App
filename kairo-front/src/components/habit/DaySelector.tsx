import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {oneHabitStyles} from "@/global";

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun'
};

interface DaySelectorProps {
    selectedDays: string[];
    onToggleDay: (day: string) => void;
}

export default function DaySelector({ selectedDays, onToggleDay }: DaySelectorProps) {
    return (
        <View style={oneHabitStyles.daysGrid}>
            <Text style={oneHabitStyles.label}>Days of Week *</Text>
            <View style={oneHabitStyles.daysGrid}>
                {DAYS.map(day => (
                    <TouchableOpacity
                        key={day}
                        onPress={() => onToggleDay(day)}
                        style={[
                            oneHabitStyles.dayButton,
                            selectedDays.includes(day) && oneHabitStyles.dayButtonActive
                        ]}
                    >
                        <Text style={[
                            oneHabitStyles.dayText,
                            selectedDays.includes(day) && oneHabitStyles.dayTextActive
                        ]}>
                            {DAY_LABELS[day]}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}
