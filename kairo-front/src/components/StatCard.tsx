// Libraries
import React from 'react';
import {GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

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

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    marginRight: 12,
    marginBottom: 20,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
});
