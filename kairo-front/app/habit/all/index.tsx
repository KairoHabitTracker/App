import React, {useEffect} from 'react';
import {ActivityIndicator, Pressable, ScrollView, Text, View} from 'react-native';
import {useRouter} from 'expo-router';
import {useHabits} from '@/src/contexts/HabitsContext';
import {allHabitsStyles, sharedFonts, sharedStyles} from '@/global';
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
                                allHabitsStyles.card,
                                {borderLeftColor: userHabit.habit.hex_color || '#3B82F6'}
                            ]}
                            onPress={() => router.push(`/habit/edit/${userHabit.id}`)}
                        >
                            <View style={allHabitsStyles.cardContent}>
                                <View style={allHabitsStyles.emojiContainer}>
                                    <Text style={{fontSize: 24}}>{userHabit.habit.emoji}</Text>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text style={allHabitsStyles.habitName}>{userHabit.habit.name}</Text>
                                    <Text style={allHabitsStyles.categoryText}>
                                        {userHabit.habit.category
                                            ? formatCategory(userHabit.habit.category)
                                            : 'General'}
                                    </Text>

                                    <Text style={allHabitsStyles.daysText}>
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

