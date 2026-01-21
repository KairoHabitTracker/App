import React from 'react';
import {Text, View} from 'react-native';
import {Habit} from '@/src/types/Habit';
import {ThemeColors} from '@/src/contexts/ThemeContext';
import {useThemedStyles} from '@/src/hooks/useThemedStyles';

interface HabitCardProps {
    habit: Habit;
}

export default function HabitCard({ habit }: HabitCardProps) {
    const styles = useHabitCardStyles();
    return (
        <View style={styles.card}>
            <View style={[styles.circle, { backgroundColor: habit.hex_color || '#eee', marginRight: 16 }]}> 
                <Text style={styles.emoji}>{habit.emoji}</Text>
            </View>

            <View style={{ flex: 1 }}>
                <Text style={styles.habitName}>{habit.name}</Text>
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{habit.category}</Text>
                </View>
            </View>
        </View>
    );
}

const createHabitCardStyles = (colors: ThemeColors) => ({
    card: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
        borderWidth: 1,
        borderColor: colors.border,
    },
    circle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emoji: {
        fontSize: 36,
    },
    habitName: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 8,
    },
    categoryBadge: {
        backgroundColor: colors.surface,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.subtleText,
        textTransform: 'capitalize',
    },
});

function useHabitCardStyles() {
    return useThemedStyles(createHabitCardStyles);
}
