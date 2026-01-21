import React from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import ColorPicker, {HueSlider, Panel5, returnedResults, Swatches} from 'reanimated-color-picker';
import {runOnJS} from 'react-native-reanimated';
import {ThemeColors} from '@/src/contexts/ThemeContext';
import {useThemedStyles} from '@/src/hooks/useThemedStyles';

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

    const styles = useColorPickerModalStyles();

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

const createColorPickerModalStyles = (colors: ThemeColors) => ({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    colorPickerModal: {
        backgroundColor: colors.card,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 40,
        maxHeight: '80%',
        borderWidth: 1,
        borderColor: colors.border,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
    modalClose: {
        fontSize: 16,
        color: colors.subtleText,
    },
    modalDone: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.accent,
    },
});

function useColorPickerModalStyles() {
    return useThemedStyles(createColorPickerModalStyles);
}