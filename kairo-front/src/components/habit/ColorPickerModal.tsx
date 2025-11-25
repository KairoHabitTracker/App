import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ColorPicker, {HueSlider, Panel5, returnedResults, Swatches} from 'reanimated-color-picker';
import {runOnJS} from 'react-native-reanimated';

// Predefiniowane kolory do szybkiego wyboru
const PRESET_COLORS = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
    '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
    '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
    '#EC4899', '#F43F5E'
];

interface ColorPickerModalProps {
    visible: boolean;
    hexColor: string;
    onColorSelect: (hex: string) => void;
    onClose: () => void;
}

export default function ColorPickerModal({
                                             visible,
                                             hexColor,
                                             onColorSelect,
                                             onClose
                                         }: ColorPickerModalProps) {

    // Callback z color pickera - musi być worklet
    const handleColorComplete = ({hex}: returnedResults) => {
        'worklet';
        runOnJS(onColorSelect)(hex);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.colorPickerModal}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.modalClose}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Choose Color</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.modalDone}>Done</Text>
                        </TouchableOpacity>
                    </View>

                    <ColorPicker
                        value={hexColor}
                        onComplete={handleColorComplete}
                        style={{width: '100%'}}
                    >
                        <Panel5 style={{marginBottom: 20}}/>

                        <HueSlider style={{marginBottom: 20}}/>

                        <Swatches
                            style={{marginTop: 20}}
                            swatchStyle={{borderRadius: 8, marginBottom: 8}}
                            colors={PRESET_COLORS}
                        />
                    </ColorPicker>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    colorPickerModal: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 40,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    modalClose: {
        fontSize: 16,
        color: '#6B7280',
    },
    modalDone: {
        fontSize: 16,
        fontWeight: '600',
        color: '#3B82F6',
    },
});