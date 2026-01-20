import AddButton from "@/src/components/AddButton";
import {useHabits} from "@/src/contexts/HabitsContext";
import {useRouter} from "expo-router";
import {useMemo, useState} from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {searchHabitStyles, sharedFonts} from "@/global";

export default function Add() {
    const {habits, loading, userHabits} = useHabits();
    const router = useRouter();

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
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={searchHabitStyles.flex}>
            <ScrollView contentContainerStyle={searchHabitStyles.container} keyboardShouldPersistTaps="handled">

                <View style={searchHabitStyles.inputCard}>
                    <TextInput
                        onChangeText={onChangeText}
                        value={text}
                        maxLength={40}
                        placeholder="Search or create a habit"
                        placeholderTextColor="#9CA3AF"
                        style={searchHabitStyles.input}
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
                                localStyles.chip,
                                selectedCategory === null ? localStyles.chipActive : localStyles.chipInactive
                            ]}
                        >
                            <Text style={[
                                localStyles.chipText,
                                selectedCategory === null ? localStyles.chipTextActive : localStyles.chipTextInactive
                            ]}>All</Text>
                        </TouchableOpacity>

                        {categories.map(cat => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                                style={[
                                    localStyles.chip,
                                    selectedCategory === cat ? localStyles.chipActive : localStyles.chipInactive
                                ]}
                            >
                                <Text style={[
                                    localStyles.chipText,
                                    selectedCategory === cat ? localStyles.chipTextActive : localStyles.chipTextInactive
                                ]}>
                                    {formatCategory(cat)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={searchHabitStyles.sectionHeaderRow}>
                    <Text style={sharedFonts.smallSubtleText}>
                        {selectedCategory ? formatCategory(selectedCategory) : 'All Suggestions'}
                    </Text>
                    {loading && <ActivityIndicator size="small" color="#6B7280"/>}
                </View>

                <View style={searchHabitStyles.suggestionsWrap}>
                    {filteredHabits.length === 0 && !loading && (
                        <Text style={[sharedFonts.smallSubtleText, {fontStyle: 'italic', marginTop: 10}]}>
                            No habits found. Create a new one above!
                        </Text>
                    )}

                    {filteredHabits.map(habit => (
                        <TouchableOpacity
                            key={habit.id}
                            onPress={() => router.push(`/habit/add/${habit.id}`)}
                            activeOpacity={0.8}
                            style={[
                                searchHabitStyles.suggestion,
                                {backgroundColor: habit.hex_color || '#eee', paddingVertical: 12}
                            ]}
                        >
                            <View style={searchHabitStyles.suggestionRow}>
                                <Text style={[sharedFonts.smallEmoji, {marginRight: 12, fontSize: 28}]}>
                                    {habit.emoji}
                                </Text>

                                <View style={{flex: 1}}>
                                    <Text style={[sharedFonts.smallText, {
                                        color: 'white',
                                        fontWeight: '700',
                                        fontSize: 16
                                    }]}>
                                        {habit.name}
                                    </Text>
                                    {habit.category && (
                                        <Text style={{color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2}}>
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

const localStyles = StyleSheet.create({
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    chipActive: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    chipInactive: {
        backgroundColor: 'white',
        borderColor: '#E5E7EB',
    },
    chipText: {
        fontSize: 13,
        fontWeight: '600',
    },
    chipTextActive: {
        color: 'white',
    },
    chipTextInactive: {
        color: '#4B5563',
    },
});