import React from 'react';
import {
    GestureResponderEvent,
    StyleProp,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import {ThemeColors, useThemeMode} from '@/src/contexts/ThemeContext';
import {useThemedStyles} from '@/src/hooks/useThemedStyles';

type IconComponent = React.ComponentType<{ size?: number; color?: string }> | React.ReactNode;

interface PickerButtonProps {
    icon?: IconComponent;
    value?: string;
    placeholder?: string;
    onPress?: (e: GestureResponderEvent) => void;
    containerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    iconSize?: number;
    iconColor?: string;
    accessibilityLabel?: string;
    testID?: string;
}

const PickerButton: React.FC<PickerButtonProps> = ({
    icon,
    value,
    placeholder = 'Select',
    onPress,
    containerStyle,
    textStyle,
    iconSize = 20,
    iconColor,
    accessibilityLabel,
    testID,
}) => {
    const {colors} = useThemeMode();
    const styles = usePickerButtonStyles();
    const effectiveIconColor = iconColor ?? colors.subtleText;
    const renderIcon = () => {
        if (!icon) return null;
        if (typeof icon === 'function') {
            const Icon = icon as React.ComponentType<any>;
            return <Icon size={iconSize} color={effectiveIconColor} />;
        }
        return icon;
    };

    return (
        <TouchableOpacity
            style={[styles.container, containerStyle]}
            onPress={onPress}
            activeOpacity={0.75}
            accessibilityLabel={accessibilityLabel}
            testID={testID}
        >
            <View style={styles.inner}>
                <View style={styles.left}>
                    {renderIcon()}
                    <Text style={[styles.text, textStyle, value ? styles.textValue : styles.textPlaceholder]}>
                        {value || placeholder}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const createPickerButtonStyles = (colors: ThemeColors) => ({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
    },
    inner: {flex: 1},
    left: {flexDirection: 'row', alignItems: 'center', gap: 12},
    text: {fontSize: 16},
    textPlaceholder: {color: colors.subtleText, fontWeight: '400'},
    textValue: {color: colors.text, fontWeight: '500'},
});

function usePickerButtonStyles() {
    return useThemedStyles(createPickerButtonStyles);
}

export default PickerButton;
