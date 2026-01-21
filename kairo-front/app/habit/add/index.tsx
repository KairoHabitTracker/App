import AddButton from "@/src/components/AddButton";
import {useHabits} from "@/src/contexts/HabitsContext";
import {useRouter} from "expo-router";
import {useMemo, useState} from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {ThemeColors, useThemeMode} from '@/src/contexts/ThemeContext';
import {useThemedStyles} from '@/src/hooks/useThemedStyles';

export default function Add() {
    const {habits, loading, userHabits} = useHabits();
    const router = useRouter();
    const {colors} = useThemeMode();
    const styles = useHabitSearchStyles();

    const [text, onChangeText] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const formatCategory = (cat: string) => {
        return cat.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const categories = useMemo(() => {
        const allCats = habits.map(h => h.category).filter(Boolean);
        return Array.from(new Set(allCats));
    }, [habits]);

    const userHabitNames = useMemo(
        () => new Set((userHabits ?? []).map((uh: any) => uh.habit?.name?.trim().toLowerCase())),
        [userHabits]
    );

    const baseSuggestions = useMemo(
        () => habits.filter(
            h => !userHabitNames.has(h.name.trim().toLowerCase())
        ),
        [habits, userHabitNames]
    );

    const filteredHabits = useMemo(() => {
        let result = baseSuggestions;

        if (selectedCategory) {
            result = result.filter(h => h.category === selectedCategory);
        }

        const q = text.trim().toLowerCase();
        if (q) {
            result = result.filter(h => h.name.toLowerCase().includes(q));
        }

        return result;
    }, [text, selectedCategory, baseSuggestions]);


    const onAdd = () => {
        router.push({pathname: '/habit/add/new', params: {gotName: text}});
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

                <View style={styles.inputCard}>
                    <TextInput
                        onChangeText={onChangeText}
                        value={text}
                        maxLength={40}
                        placeholder="Search or create a habit"
                        placeholderTextColor={colors.subtleText}
                        style={styles.input}
                        returnKeyType="done"
                    />
                    {filteredHabits.length === 0 && !loading && (
                        <View>
                            <AddButton onPress={onAdd}/>
                        </View>
                    )}
                </View>

                <View style={{marginBottom: 16, height: 35}}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{gap: 8, paddingHorizontal: 4}}>
                        <TouchableOpacity
                            onPress={() => setSelectedCategory(null)}
                            style={[
                                styles.chip,
                                selectedCategory === null ? styles.chipActive : styles.chipInactive
                            ]}
                        >
                            <Text style={[
                                styles.chipText,
                                selectedCategory === null ? styles.chipTextActive : styles.chipTextInactive
                            ]}>All</Text>
                        </TouchableOpacity>

                        {categories.map(cat => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                                style={[
                                    styles.chip,
                                    selectedCategory === cat ? styles.chipActive : styles.chipInactive
                                ]}
                            >
                                <Text style={[
                                    styles.chipText,
                                    selectedCategory === cat ? styles.chipTextActive : styles.chipTextInactive
                                ]}>
                                    {formatCategory(cat)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionHeaderText}>
                        {selectedCategory ? formatCategory(selectedCategory) : 'All Suggestions'}
                    </Text>
                    {loading && <ActivityIndicator size="small" color={colors.subtleText}/>}
                </View>

                <View style={styles.suggestionsWrap}>
                    {filteredHabits.length === 0 && !loading && (
                        <Text style={styles.emptyText}>
                            No habits found. Create a new one above!
                        </Text>
                    )}

                    {filteredHabits.map(habit => (
                        <TouchableOpacity
                            key={habit.id}
                            onPress={() => router.push(`/habit/add/${habit.id}`)}
                            activeOpacity={0.8}
                            style={[
                                styles.suggestion,
                                {backgroundColor: habit.hex_color || '#eee', paddingVertical: 12}
                            ]}
                        >
                            <View style={styles.suggestionRow}>
                                <Text style={styles.suggestionEmoji}> 
                                    {habit.emoji}
                                </Text>

                                <View style={{flex: 1}}>
                                    <Text style={styles.suggestionTitle}> 
                                        {habit.name}
                                    </Text>
                                    {habit.category && (
                                        <Text style={styles.suggestionCategory}>
                                            {formatCategory(habit.category)}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const createHabitSearchStyles = (colors: ThemeColors) => ({
    screen: {flex: 1, backgroundColor: colors.background},
    container: {padding: 16, alignItems: 'center', gap: 12},
    inputCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: colors.card,
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 12,
    },
    input: {
        fontSize: 16,
        padding: 8,
        flex: 1,
        color: colors.text,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    chipActive: {
        backgroundColor: colors.accent,
        borderColor: colors.accent,
    },
    chipInactive: {
        backgroundColor: colors.surface,
        borderColor: colors.border,
    },
    chipText: {
        fontSize: 13,
        fontWeight: '600',
    },
    chipTextActive: {
        color: colors.background,
    },
    chipTextInactive: {
        color: colors.text,
    },
    sectionHeaderRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionHeaderText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.subtleText,
    },
    suggestionsWrap: {
        width: '100%',
        gap: 8,
    },
    suggestion: {
        paddingHorizontal: 12,
        borderRadius: 999,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 2,
    },
    suggestionRow: {flexDirection: 'row', alignItems: 'center'},
    suggestionEmoji: {marginRight: 12, fontSize: 28},
    suggestionTitle: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    suggestionCategory: {color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2},
    emptyText: {
        fontSize: 13,
        color: colors.subtleText,
        fontStyle: 'italic',
        marginTop: 10,
        textAlign: 'center',
    },
});

function useHabitSearchStyles() {
    return useThemedStyles(createHabitSearchStyles);
}