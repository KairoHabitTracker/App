import React from 'react';
import {Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {X} from '@tamagui/lucide-icons';
import {ThemeColors, useThemeMode} from '@/src/contexts/ThemeContext';
import {useThemedStyles} from '@/src/hooks/useThemedStyles';

interface PickerModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    children: React.ReactNode;
    title?: string;
}

export default function PickerModal({visible, onClose, onConfirm, children, title = 'Select'}: PickerModalProps) {
    const styles = usePickerModalStyles();
    const {colors} = useThemeMode();
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback onPress={() => {
                    }}>
                        <View style={styles.content}>
                            <View style={styles.header}>
                                <TouchableOpacity onPress={onClose}>
                                    <X size={24} color={colors.subtleText}/>
                                </TouchableOpacity>
                                <Text style={styles.title}>{title}</Text>
                                <TouchableOpacity onPress={onConfirm}>
                                    <Text style={styles.doneButton}>Done</Text>
                                </TouchableOpacity>
                            </View>
                            {children}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const createPickerModalStyles = (colors: ThemeColors) => ({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: colors.card,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 34,
        borderWidth: 1,
        borderColor: colors.border,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    doneButton: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.accent,
    },
});

function usePickerModalStyles() {
    return useThemedStyles(createPickerModalStyles);
}