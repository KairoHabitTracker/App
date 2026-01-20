import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

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
    onToggleAll: () => void;
    activeColor: string;
}

export default function DaySelector({selectedDays, onToggleDay, onToggleAll, activeColor}: DaySelectorProps) {
    const isAllSelected = selectedDays.length === 7;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.label}>Frequency *</Text>
                <TouchableOpacity onPress={onToggleAll}>
                    <Text style={[styles.selectAllText, {color: activeColor}]}>
                        {isAllSelected ? 'Deselect All' : 'Select All'}
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
                                isSelected && {backgroundColor: activeColor, borderColor: activeColor}
                            ]}
                        >
                            <Text style={[
                                styles.dayText,
                                isSelected && styles.dayTextActive
                            ]}>
                                {DAY_LABELS[day]}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {marginBottom: 20},
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    label: {fontSize: 14, fontWeight: '600', color: '#374151'},
    selectAllText: {fontSize: 13, fontWeight: '600'},
    daysGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8
    },
    dayButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    dayText: {fontSize: 12, fontWeight: '600', color: '#6B7280'},
    dayTextActive: {color: 'white'},
});
