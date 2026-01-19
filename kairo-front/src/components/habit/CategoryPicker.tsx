import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {CATEGORY_DATA} from "@/src/const/categories";

interface CategoryPickerProps {
    category: string;
    onCategorySelect: (category: string, color: string) => void;
}

export default function CategoryPicker({category, onCategorySelect}: CategoryPickerProps) {
    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesScroll}
            >
                {CATEGORY_DATA.map((cat) => {
                    const isActive = category === cat.value;
                    return (
                        <TouchableOpacity
                            key={cat.value}
                            style={[
                                styles.categoryChip,
                                isActive && {backgroundColor: cat.color}
                            ]}
                            onPress={() => onCategorySelect(cat.value, cat.color)}
                        >
                            <Text style={[
                                styles.categoryChipText,
                                isActive && styles.categoryChipTextActive
                            ]}>
                                {cat.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        padding: 16,
        backgroundColor: '#F9FAFB',
    },
    previewSection: {
        marginBottom: 24,
        alignItems: 'center',
    },
    previewCard: {
        width: '100%',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    emojiCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    bigEmoji: {
        fontSize: 48,
    },
    previewName: {
        fontSize: 24,
        fontWeight: '700',
        color: 'white',
        textAlign: 'center',
    },
    formSection: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: '#111827',
    },
    row: {
        flexDirection: 'row',
    },
    emojiButton: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
    },
    emojiButtonText: {
        fontSize: 32,
    },
    colorButton: {
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    colorButtonText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '600',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: {width: 0, height: 1},
        textShadowRadius: 2,
    },
    categoriesScroll: {
        paddingVertical: 4,
    },
    categoryChip: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    categoryChipActive: {
        backgroundColor: '#3B82F6',
    },
    categoryChipText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    categoryChipTextActive: {
        color: 'white',
    },
    submitButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
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
