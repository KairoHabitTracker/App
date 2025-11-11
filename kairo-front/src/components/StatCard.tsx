// Libraries
import React from 'react';
import {GestureResponderEvent, Text, TouchableOpacity, View} from 'react-native';

// Styles
import {profileStyles as styles} from '@/global';

type Props = {
    label?: string;
    value: React.ReactNode;
    onPress?: (event: GestureResponderEvent) => void;
};

export default function StatCard({label, value, onPress}: Props) {
    const Content = (
        <View style={styles.statCard}>
            {label ? <Text style={styles.statLabel}>{label}</Text> : null}
            <Text style={styles.statValue}>{value}</Text>
        </View>
    );

    if (onPress) return <TouchableOpacity onPress={onPress}>{Content}</TouchableOpacity>;
    return Content;
}
