import React from 'react';
import {Text, View} from 'react-native';
import {Habit} from '@/src/types/Habit';
import {oneHabitStyles} from "@/global";

interface HabitCardProps {
    habit: Habit;
}

export default function HabitCard({ habit }: HabitCardProps) {
    return (
        <View style={oneHabitStyles.card}>
            <View style={[oneHabitStyles.circle, { backgroundColor: habit.hex_color || '#eee' }]}>
                <Text style={oneHabitStyles.emoji}>{habit.emoji}</Text>
            </View>

            <View style={oneHabitStyles.content}>
                <Text style={oneHabitStyles.name}>{habit.name}</Text>
                <View style={oneHabitStyles.categoryBadge}>
                    <Text style={oneHabitStyles.categoryText}>{habit.category}</Text>
                </View>
            </View>
        </View>
    );
}
