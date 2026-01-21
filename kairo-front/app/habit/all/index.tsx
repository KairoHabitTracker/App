import React, {useEffect} from 'react';
import {ActivityIndicator, Pressable, ScrollView, Text, View} from 'react-native';
import {useRouter} from 'expo-router';
import {useHabits} from '@/src/contexts/HabitsContext';
import {ChevronRight} from '@tamagui/lucide-icons';
import {ThemeColors, useThemeMode} from '@/src/contexts/ThemeContext';
import {useThemedStyles} from '@/src/hooks/useThemedStyles';

export default function AllHabitsScreen() {
    const router = useRouter();
    const {userHabits, fetchUserHabits, loading} = useHabits();
    const {colors} = useThemeMode();
    const styles = useMyHabitsStyles();

    useEffect(() => {
        fetchUserHabits();
    }, []);

    const formatCategory = (cat: string) => {
        return cat.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    if (loading && userHabits.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.accent}/>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Habits</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {userHabits.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No habits found.</Text>
                        <Text style={[styles.emptyText, {marginTop: 8}]}> 
                            Go to Home to create one!
                        </Text>
                    </View>
                ) : (
                    userHabits.map((userHabit) => (
                        <Pressable
                            key={userHabit.id}
                            style={[
                                styles.card,
                {borderLeftColor: userHabit.habit.hex_color || colors.accent}
                            ]}
                            onPress={() => router.push(`/habit/edit/${userHabit.id}`)}
                        >
                            <View style={styles.cardContent}>
                                <View style={styles.emojiContainer}>
                                    <Text style={{fontSize: 24}}>{userHabit.habit.emoji}</Text>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text style={styles.habitName}>{userHabit.habit.name}</Text>
                                    <Text style={styles.categoryText}>
                                        {userHabit.habit.category
                                            ? formatCategory(userHabit.habit.category)
                                            : 'General'}
                                    </Text>

                                    <Text style={styles.daysText}>
                                        {userHabit.days_of_week && userHabit.days_of_week.length > 0
                                            ? userHabit.days_of_week.map(d => d.slice(0, 3).toUpperCase()).join(', ')
                                            : 'Everyday'}
                                    </Text>
                                </View>
                                <ChevronRight size={20} color={colors.subtleText}/>
                            </View>
                        </Pressable>
                    ))
                )}
                <View style={{height: 40}}/>
            </ScrollView>
        </View>
    );
}

const createMyHabitsStyles = (colors: ThemeColors) => ({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 60,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.text,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    emptyState: {
        marginTop: 50,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: colors.subtleText,
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: 16,
        marginBottom: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    emojiContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    habitName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 2,
    },
    categoryText: {
        fontSize: 12,
        color: colors.subtleText,
        marginBottom: 4,
    },
    daysText: {
        fontSize: 11,
        color: colors.subtleText,
        fontWeight: '500',
    },
});

function useMyHabitsStyles() {
    return useThemedStyles(createMyHabitsStyles);
}

