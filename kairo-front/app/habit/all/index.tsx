import React, {useEffect} from 'react';
import {ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useRouter} from 'expo-router';
import {useHabits} from '@/src/contexts/HabitsContext';
import {sharedFonts, sharedStyles} from '@/global';
import {ChevronRight} from '@tamagui/lucide-icons';

export default function AllHabitsScreen() {
    const router = useRouter();
    const {userHabits, fetchUserHabits, loading} = useHabits();

    useEffect(() => {
        fetchUserHabits();
    }, []);

    const formatCategory = (cat: string) => {
        return cat.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    if (loading && userHabits.length === 0) {
        return (
            <View style={[sharedStyles.basicContainer, {justifyContent: 'center', alignItems: 'center'}]}>
                <ActivityIndicator size="large" color="#3B82F6"/>
            </View>
        );
    }

    return (
        <View style={[sharedStyles.basicContainer, {paddingTop: 60}]}>
            <View style={{paddingHorizontal: 20, marginBottom: 20, flexDirection: 'row', alignItems: 'center'}}>
                <Text style={sharedFonts.headerText}>My Habits</Text>
            </View>

            <ScrollView contentContainerStyle={sharedStyles.scrollContent}>
                {userHabits.length === 0 ? (
                    <View style={[sharedStyles.center, {marginTop: 50}]}>
                        <Text style={sharedFonts.mediumSubtleText}>No habits found.</Text>
                        <Text style={[sharedFonts.mediumSubtleText, {marginTop: 8}]}>
                            Go to Home to create one!
                        </Text>
                    </View>
                ) : (
                    userHabits.map((userHabit) => (
                        <Pressable
                            key={userHabit.id}
                            style={[
                                styles.card,
                                {borderLeftColor: userHabit.habit.hex_color || '#3B82F6'}
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
                                <ChevronRight size={20} color="#9CA3AF"/>
                            </View>
                        </Pressable>
                    ))
                )}
                <View style={{height: 40}}/>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        marginBottom: 12,
        padding: 16,
        borderLeftWidth: 4,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emojiContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    habitName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    categoryText: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    daysText: {
        fontSize: 10,
        color: '#9CA3AF',
        fontWeight: '500',
    }
});