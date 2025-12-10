import React from 'react';
import {
    GestureResponderEvent,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

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
                                                       iconColor = '#6B7280',
                                                       accessibilityLabel,
                                                       testID,
                                                   }) => {
    const renderIcon = () => {
        if (!icon) return null;
        if (typeof icon === 'function') {
            const Icon = icon as React.ComponentType<any>;
            return <Icon size={iconSize} color={iconColor} />;
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

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
    },
    inner: { flex: 1 },
    left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    text: { fontSize: 16 },
    textPlaceholder: { color: '#9CA3AF', fontWeight: '400' },
    textValue: { color: '#111827', fontWeight: '500' },
});

export default PickerButton;