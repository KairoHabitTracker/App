import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {CATEGORY_DATA} from "@/src/const/categories";
import {ThemeColors} from '@/src/contexts/ThemeContext';
import {useThemedStyles} from '@/src/hooks/useThemedStyles';

interface CategoryPickerProps {
    category: string;
    onCategorySelect: (category: string, color: string) => void;
}

export default function CategoryPicker({category, onCategorySelect}: CategoryPickerProps) {
    const styles = useCategoryPickerStyles();
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
                                    isActive && {backgroundColor: cat.color, borderColor: cat.color}
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

const createCategoryPickerStyles = (colors: ThemeColors) => ({
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
    },
    categoriesScroll: {
        paddingVertical: 4,
    },
    categoryChip: {
        backgroundColor: colors.surface,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    categoryChipText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.subtleText,
    },
    categoryChipTextActive: {
        color: '#fff',
    },
});

function useCategoryPickerStyles() {
    return useThemedStyles(createCategoryPickerStyles);
}
