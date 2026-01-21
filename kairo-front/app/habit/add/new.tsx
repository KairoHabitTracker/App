import React, {useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {useAuth} from '@/src/contexts/AuthContext';
import {API_BASE} from '@/src/lib/api';
import {useDateTimePickers} from '@/src/hooks/useDateTimePickers';
import DaySelector from '@/src/components/habit/DaySelector';
import DateTimePickerGroup from '@/src/components/habit/DateTimePickerGroup';
import CategoryPicker from '@/src/components/habit/CategoryPicker';
import EmojiPicker from '@/src/components/habit/EmojiPicker';
import ColorPickerModal from '@/src/components/habit/ColorPickerModal';
import {ThemeColors, useThemeMode} from '@/src/contexts/ThemeContext';
import {useThemedStyles} from '@/src/hooks/useThemedStyles';

export default function NewHabitDetail() {
    const {token} = useAuth();
    const router = useRouter();
    const {colors} = useThemeMode();
    const styles = useCustomHabitStyles();

    const params = useLocalSearchParams<{ gotName?: string }>();
    const initialName = params.gotName ?? '';

    const [name, setName] = useState<string>(initialName);
    const [emoji, setEmoji] = useState('🙉');
    const [hexColor, setHexColor] = useState('#f11f9d');
    const [category, setCategory] = useState('other');

    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [enableNotifications, setEnableNotifications] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);

    const pickerState = useDateTimePickers();

    const handleCategorySelect = (newCategory: string, newColor: string) => {
        setCategory(newCategory);
        setHexColor(newColor);
    };

    const toggleDay = (day: string) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const toggleAllDays = () => {
        if (selectedDays.length === 7) {
            setSelectedDays([]);
        } else {
            setSelectedDays(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
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
                category,
            };

            const customHabitResponse = await fetch(`${API_BASE}/api/habits/custom`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customHabitPayload),
            });

            const customHabit = await customHabitResponse.json();
            const habitId = customHabit?.data?.id;
            if (!habitId) {
                throw new Error('Missing habit id in response');
            }

            const userHabitPayload = {
                habit_id: habitId,
                notification_time: pickerState.notificationTime || null,
                days_of_week: selectedDays,
                start_date: pickerState.startDate || null,
                end_date: pickerState.endDate || null,
            };

            await fetch(`${API_BASE}/api/habits/user`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userHabitPayload),
            });

            Alert.alert('Success', 'Custom habit created and added to your routine!', [
                {text: 'OK', onPress: () => router.replace('/home')},
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
            <ScrollView
                style={styles.screen}
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.previewSection}>
                    <View style={[styles.previewCard, {backgroundColor: hexColor}]}> 
                        <View style={styles.emojiCircle}>
                            <Text style={styles.bigEmoji}>{emoji}</Text>
                        </View>
                        <Text style={styles.previewName}>{name || 'Habit Name'}</Text>
                    </View>
                </View>

                <View style={styles.formSection}>
                    <CategoryPicker
                        category={category}
                        onCategorySelect={handleCategorySelect}
                    />

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Habit Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Drink Water"
                            placeholderTextColor={colors.subtleText}
                            value={name}
                            onChangeText={setName}
                            maxLength={255}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, styles.rowItem]}>
                            <Text style={styles.label}>Emoji *</Text>
                            <TouchableOpacity
                                style={styles.emojiButton}
                                onPress={() => setShowEmojiPicker(true)}
                            >
                                <Text style={styles.emojiButtonText}>{emoji}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.inputGroup, styles.rowItem]}>
                            <Text style={styles.label}>Color *</Text>
                            <TouchableOpacity
                                style={[styles.colorButton, {backgroundColor: hexColor}]}
                                onPress={() => setShowColorPicker(true)}
                            >
                                <Text style={styles.colorButtonText}>{hexColor}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <DaySelector
                        selectedDays={selectedDays}
                        onToggleDay={toggleDay}
                        onToggleAll={toggleAllDays}
                        activeColor={hexColor}
                    />

                    <View style={styles.reminderHeader}>
                        <Text style={styles.label}>Reminders & Dates</Text>
                        <Switch
                            value={enableNotifications}
                            onValueChange={setEnableNotifications}
                            trackColor={{false: colors.border, true: `${hexColor}80`}}
                            thumbColor={enableNotifications ? '#fff' : colors.surface}
                        />
                    </View>

                    {enableNotifications && (
                        <View style={styles.remindersContainer}>
                            <Text style={styles.helperText}>
                                We&apos;ll send you notifications on selected days.
                            </Text>
                            <DateTimePickerGroup {...pickerState} />
                        </View>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            {backgroundColor: hexColor},
                            submitting && styles.submitButtonDisabled,
                        ]}
                        onPress={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <ActivityIndicator color="#fff" />
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

const createCustomHabitStyles = (colors: ThemeColors) => ({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        padding: 16,
        paddingBottom: 32,
        gap: 24,
    },
    previewSection: {
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
        backgroundColor: 'rgba(255,255,255,0.25)',
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
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: colors.text,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    rowItem: {
        flex: 1,
    },
    emojiButton: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
    },
    emojiButtonText: {
        fontSize: 32,
        color: colors.text,
    },
    colorButton: {
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        borderWidth: 2,
        borderColor: colors.surface,
    },
    colorButtonText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '600',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: {width: 0, height: 1},
        textShadowRadius: 2,
    },
    reminderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    remindersContainer: {
        gap: 12,
    },
    helperText: {
        fontSize: 13,
        color: colors.subtleText,
    },
    submitButton: {
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
});

function useCustomHabitStyles() {
    return useThemedStyles(createCustomHabitStyles);
}
