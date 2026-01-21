import React from 'react';
import {Switch, Text, View} from 'react-native';
import {useThemeMode} from '@/src/contexts/ThemeContext';
import {useThemedStyles} from '@/src/hooks/useThemedStyles';
import {ThemeColors} from '@/src/contexts/ThemeContext';

interface SettingsRowProps {
    icon: React.ElementType;
    title: string;
    description?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    color?: string;
}

const createSettingsRowStyles = (colors: ThemeColors) => ({
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
    settingText: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: 13,
        color: colors.subtleText,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
});

const useSettingsRowStyles = () => useThemedStyles(createSettingsRowStyles);

export const SettingsRow = ({
                                icon: Icon,
                                title,
                                description,
                                value,
                                onValueChange,
                                color
                            }: SettingsRowProps) => {
    const {colors} = useThemeMode();
    const styles = useSettingsRowStyles();
    const iconColor = color ?? colors.accent;

    return (
        <View style={styles.settingRow}>
            <View style={[styles.settingInfo, styles.infoContainer]}>

                <View style={styles.iconContainer}>
                    <Icon size={22} color={iconColor}/>
                </View>

                <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{title}</Text>
                    {description && (
                        <Text style={styles.settingDescription}>{description}</Text>
                    )}
                </View>
            </View>

            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{false: colors.border, true: colors.accent}}
                thumbColor={value ? colors.card : colors.surface}
            />
        </View>
    );
};

