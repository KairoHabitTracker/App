import React from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';

interface SettingsRowProps {
    icon: React.ElementType;
    title: string;
    description?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    color?: string;
}

export const SettingsRow = ({
                                icon: Icon,
                                title,
                                description,
                                value,
                                onValueChange,
                                color = "#3B82F6"
                            }: SettingsRowProps) => {
    return (
        <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
                <Icon size={20} color={color} style={styles.settingIcon}/>
                <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{title}</Text>
                    {description && <Text style={styles.settingDescription}>{description}</Text>}
                </View>
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{false: '#E5E7EB', true: '#93C5FD'}}
                thumbColor={value ? '#3B82F6' : '#F3F4F6'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    settingInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIcon: {
        marginRight: 12,
    },
    settingText: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: 13,
        color: '#6B7280',
    },
});