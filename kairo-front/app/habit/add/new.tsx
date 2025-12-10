import React, {useState} from 'react';
import {ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {useAuth} from '@/src/contexts/AuthContext';
import {API_BASE} from '@/src/lib/api';
import {useDateTimePickers} from '@/src/hooks/useDateTimePickers';
import DaySelector from "@/src/components/habit/DaySelector";
import DateTimePickerGroup from "@/src/components/habit/DateTimePickerGroup";
import CategoryPicker from "@/src/components/habit/CategoryPicker";
import EmojiPicker from "@/src/components/habit/EmojiPicker";
import ColorPickerModal from "@/src/components/habit/ColorPickerModal";


export default function NewHabitDetail() {
    const {token} = useAuth();
    const router = useRouter();

    const params = useLocalSearchParams<{ gotName?: string }>();
    const initialName = params.gotName ?? ''

    const [name, setName] = useState<string>(initialName);
    const [emoji, setEmoji] = useState('🙉');
    const [hexColor, setHexColor] = useState('#f11f9d');
    const [category, setCategory] = useState('other');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);

    const pickerState = useDateTimePickers();

    const toggleDay = (day: string) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const handleSubmit = async () => {
        if (!name || !emoji || selectedDays.length === 0) {
            Alert.alert('Error', 'Please fill all required fields and select at least one day');
            return;
        }

        setSubmitting(true);
        try {
            const customHabitPayload = {
                name,
                emoji,
                hex_color: hexColor,
                category
            };

            const customHabitResponse = await fetch(`${API_BASE}/api/habits/custom`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customHabitPayload)
            });

            const customHabit = await customHabitResponse.json();
            const habitId = customHabit?.data?.id
            if (!habitId) {
                throw new Error('Missing habit id in response');
            }

            const userHabitPayload = {
                habit_id: habitId,
                notification_time: pickerState.notificationTime || null,
                days_of_week: selectedDays,
                start_date: pickerState.startDate || null,
                end_date: pickerState.endDate || null
            };

            await fetch(`${API_BASE}/api/habits/user`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userHabitPayload)
            });

            Alert.alert('Success', 'Custom habit created and added to your routine!', [
                {text: 'OK', onPress: () => router.replace('/home')}
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to create habit');
        } finally {
            setSubmitting(false);
        }
    };

    if (showEmojiPicker) {
        return (
            <EmojiPicker
                showEmoji={showEmojiPicker}
                setEmoji={setEmoji}
                setShowEmoji={setShowEmojiPicker}
            />
        );
    }
    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.previewSection}>
                    <View style={[styles.previewCard, {backgroundColor: hexColor}]}>
                        <View style={styles.emojiCircle}>
                            <Text style={styles.bigEmoji}>{emoji}</Text>
                        </View>
                        <Text style={styles.previewName}>{name || 'Habit Name'}</Text>
                    </View>
                </View>

                <View style={styles.formSection}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Habit Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Drink Water"
                            placeholderTextColor="#9CA3AF"
                            value={name}
                            onChangeText={setName}
                            maxLength={255}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, {flex: 1, marginRight: 8}]}>
                            <Text style={styles.label}>Emoji *</Text>
                            <TouchableOpacity
                                style={styles.emojiButton}
                                onPress={() => setShowEmojiPicker(true)}
                            >
                                <Text style={styles.emojiButtonText}>{emoji}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.inputGroup, {flex: 1, marginLeft: 8}]}>
                            <Text style={styles.label}>Color *</Text>
                            <TouchableOpacity
                                style={[styles.colorButton, {backgroundColor: hexColor}]}
                                onPress={() => setShowColorPicker(true)}
                            >
                                <Text style={styles.colorButtonText}>{hexColor}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <CategoryPicker category={category} setCategory={setCategory}/>
                    <DaySelector selectedDays={selectedDays} onToggleDay={toggleDay}/>
                    <DateTimePickerGroup {...pickerState} />

                    <TouchableOpacity
                        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <ActivityIndicator color="#fff"/>
                        ) : (
                            <Text style={styles.submitText}>Create Custom Habit</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <ColorPickerModal
                visible={showColorPicker}
                hexColor={hexColor}
                onColorSelect={setHexColor}
                onClose={() => setShowColorPicker(false)}
            />
        </>
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