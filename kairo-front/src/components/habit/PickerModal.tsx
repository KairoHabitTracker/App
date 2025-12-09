import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {X} from '@tamagui/lucide-icons';

interface PickerModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    children: React.ReactNode;
    title?: string;
}

export default function PickerModal({visible, onClose, onConfirm, children, title = 'Select'}: PickerModalProps) {
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
                                    <X size={24} color="#6B7280"/>
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

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 34,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827'
    },
    doneButton: {
        fontSize: 16,
        fontWeight: '600',
        color: '#3B82F6'
    },
});