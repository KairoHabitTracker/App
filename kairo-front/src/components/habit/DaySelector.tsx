import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {oneHabitStyles, sharedFonts} from "@/global";

const DAYS: string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS: any = {
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

export default function DaySelector({selectedDays, onToggleDay}: DaySelectorProps) {
    return (
        <View style={oneHabitStyles.daysGrid}>
            <Text style={oneHabitStyles.categoryText}>Days of Week *</Text>
            <View style={oneHabitStyles.daysGrid}>
                {DAYS.map(day => (
                    <TouchableOpacity
                        key={day}
                        onPress={() => onToggleDay(day)}
                        style={[
                            oneHabitStyles.dayButton,
                            selectedDays.includes(day) && oneHabitStyles.dayButtonActive //maybe change the color accordingly?
                        ]}
                    >
                        <Text style={[
                            sharedFonts.smallSubtleText,
                            {fontWeight: '600'},
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
