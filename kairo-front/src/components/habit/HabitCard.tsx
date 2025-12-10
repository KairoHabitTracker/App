import React from 'react';
import {Text, View} from 'react-native';
import {Habit} from '@/src/types/Habit';
import {oneHabitStyles, sharedFonts, sharedStyles} from "@/global";

interface HabitCardProps {
    habit: Habit;
}

export default function HabitCard({ habit }: HabitCardProps) {
    return (
        <View style={oneHabitStyles.card}>
            <View style={[oneHabitStyles.circle, { backgroundColor: habit.hex_color || '#eee' ,marginRight: 16, }]}>
                <Text style={sharedFonts.biggerEmoji}>{habit.emoji}</Text>
            </View>

            <View style={{ flex: 1 }}>
                <Text style={[sharedFonts.bigText,{marginBottom: 8,}]}>{habit.name}</Text>
                <View style={sharedStyles.categoryBadge}>
                    <Text style={oneHabitStyles.categoryText}>{habit.category}</Text>
                </View>
            </View>
        </View>
    );
}
