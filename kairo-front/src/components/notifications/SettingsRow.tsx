import React from 'react';
import {Switch, Text, View} from 'react-native';
import {settingRowStyles} from "@/global";

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
        <View style={settingRowStyles.settingRow}>
            <View style={settingRowStyles.settingInfo}>
                <Icon size={20} color={color} style={settingRowStyles.settingIcon}/>
                <View style={settingRowStyles.settingText}>
                    <Text style={settingRowStyles.settingTitle}>{title}</Text>
                    {description && <Text style={settingRowStyles.settingDescription}>{description}</Text>}
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

