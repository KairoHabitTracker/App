import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {ThemeColors} from '@/src/contexts/ThemeContext';
import {useThemedStyles} from '@/src/hooks/useThemedStyles';

const DAYS: string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS: Record<string, string> = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
};

interface DaySelectorProps {
    selectedDays: string[];
    onToggleDay: (day: string) => void;
    onToggleAll: () => void;
    activeColor: string;
}

export default function DaySelector({selectedDays, onToggleDay, onToggleAll, activeColor}: DaySelectorProps): JSX.Element {
    const styles = useDaySelectorStyles();
    const isAllSelected = selectedDays.length === DAYS.length;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.label}>Schedule</Text>
                <TouchableOpacity onPress={onToggleAll} hitSlop={8}>
                    <Text style={[styles.selectAllText, {color: activeColor}]}> 
                        {isAllSelected ? 'Clear All' : 'Select All'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.daysGrid}>
                {DAYS.map(day => {
                    const isSelected = selectedDays.includes(day);
                    return (
                        <TouchableOpacity
                            key={day}
                            onPress={() => onToggleDay(day)}
                            style={[
                                styles.dayButton,
                                isSelected && {backgroundColor: activeColor, borderColor: activeColor},
                            ]}
                        >
                            <Text style={[styles.dayText, isSelected && styles.dayTextActive]}>
                                {DAY_LABELS[day]}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const createDaySelectorStyles = (colors: ThemeColors) => ({
    container: {gap: 12},
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {fontSize: 14, fontWeight: '600', color: colors.text},
    selectAllText: {fontSize: 13, fontWeight: '600'},
    daysGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        rowGap: 12,
    },
    dayButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.surface,
    },
    dayText: {fontSize: 12, fontWeight: '600', color: colors.subtleText},
    dayTextActive: {color: '#fff'},
});

function useDaySelectorStyles() {
    return useThemedStyles(createDaySelectorStyles);
}
