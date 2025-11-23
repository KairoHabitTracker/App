import AddButton from "@/src/components/AddButton";
import { useAuth } from "@/src/contexts/AuthContext";
import { API_BASE } from '@/src/lib/api';
import { Habit } from "@/src/types/Habit";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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

export default function AddHabit() {
    const {token} = useAuth();
    const router = useRouter();

    const [habits, setHabits] = useState<Habit[]>([]);
    const [text, onChangeText] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (token) {
            getPredefinedHabits().then(r => {
                setHabits(r);
            });
        }
    }, [token]);


    const getPredefinedHabits = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/api/habits`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const json = await response.json();
            const data = json.data;
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error(error);
            return [];
        } finally {
            setLoading(false);
        }
    }

    const filteredHabits = useMemo(() => {
        const q = text.trim().toLowerCase();
        if (!q) return habits;
        return habits.filter(h => (
            h.name.toLowerCase().includes(q)
        ));
    }, [habits, text]);

    const onAdd = () => {
        if (text.trim()) {
            router.push(`/habit/`);
        } else {
            router.push('/habit/new');
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <View style={styles.inputCard}>
                    <TextInput
                        onChangeText={onChangeText}
                        value={text}
                        maxLength={40}
                        placeholder="Search or create a habit"
                        placeholderTextColor="#9CA3AF"
                        style={styles.input}
                        returnKeyType="done"
                    />
                    {filteredHabits.length === 0 && !loading && (
                        <View>
                            <AddButton onPress={onAdd}/>
                        </View>

                    )}
                </View>

                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionHeader}>Suggestions</Text>
                    {loading && <ActivityIndicator size="small" color="#6B7280"/>}
                </View>

                <View style={styles.suggestionsWrap}>
                    {filteredHabits.length === 0 && !loading && (
                        <Text style={styles.emptyText}>Not on the list? Create a new habit above.</Text>

                    )}

                    {filteredHabits.map(habit => (
                        <TouchableOpacity
                            key={habit.id}
                            onPress={() => router.push('/habit/${habit.id}')}
                            activeOpacity={0.8}
                            style={[styles.suggestion, {backgroundColor: habit.hex_color || '#eee'}]}
                        >
                            <View style={styles.suggestionRow}>
                                <Text style={styles.emoji}>{habit.emoji}</Text>
                                <Text style={styles.habitName}>{habit.name}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>

    );
}

const styles = StyleSheet.create({
    flex: {flex: 1},
    container: {padding: 16, alignItems: 'center'},
    inputCard: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        // shadow
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    input: {
        fontSize: 16,
        padding: 8,
    },
    sectionHeaderRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionHeader: {fontSize: 12, color: '#374151', fontWeight: '600'},
    suggestionsWrap: {
        width: '100%',
        display: 'flex',
        gap: 8,
    },
    suggestion: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 999,
        // shadow
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 8,
    },
    suggestionRow: {flexDirection: 'row', alignItems: 'center'},
    emoji: {fontSize: 20, marginRight: 10},
    habitName: {fontSize: 16, color: '#111827'},
    emptyText: {color: '#6B7280', fontStyle: 'italic', padding: 12},

});
