import AddButton from "@/src/components/AddButton";
import {useHabits} from "@/src/contexts/HabitContext";
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
import {searchHabitStyles, sharedFonts} from "@/global";

export default function Add() {
    const {habits, loading, userHabits} = useHabits();
    const router = useRouter();

    const [text, onChangeText] = useState<string>('');


    const userHabitNames = useMemo(
        () => new Set((userHabits ?? []).map((uh: any) => uh.habit?.name?.trim().toLowerCase())),
        [userHabits]
    );

    const filteredSuggestions = useMemo(
        () => habits.filter(
            h => !userHabitNames.has(h.name.trim().toLowerCase())
        ),
        [habits, userHabitNames]
    );

    const filteredHabits = useMemo(() => {
        const q = text.trim().toLowerCase();
        if (!q) return filteredSuggestions;
        return filteredSuggestions.filter(h => (
            h.name.toLowerCase().includes(q)
        ));
    }, [text, filteredSuggestions]);


    const onAdd = () => {
        router.push({pathname: '/habit/new', params: {gotName: text}});
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

                <View style={searchHabitStyles.sectionHeaderRow}>
                    <Text style={sharedFonts.smallSubtleText}>Suggestions</Text>
                    {loading && <ActivityIndicator size="small" color="#6B7280"/>}
                </View>

                <View style={searchHabitStyles.suggestionsWrap}>
                    {filteredHabits.length === 0 && !loading && (
                        <Text style={[sharedFonts.smallSubtleText, {fontStyle: 'italic'}]}>Not on the list? Create a new
                            habit above.</Text>
                    )}

                    {filteredHabits.map(habit => (
                        <TouchableOpacity
                            key={habit.id}
                            onPress={() => router.push(`/habit/${habit.id}`)}
                            activeOpacity={0.8}
                            style={[searchHabitStyles.suggestion, {backgroundColor: habit.hex_color || '#eee'}]}
                        >
                            <View style={searchHabitStyles.suggestionRow}>
                                <Text style={[sharedFonts.smallEmoji, {marginRight: 10}]}>{habit.emoji}</Text>
                                <Text style={sharedFonts.smallText}>{habit.name}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

