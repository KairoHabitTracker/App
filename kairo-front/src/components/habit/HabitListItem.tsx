import React, {useRef} from 'react';
import {Pressable, Text, View} from "react-native";
import {Check, Flame, RotateCcw} from "@tamagui/lucide-icons";
import Swipeable, {SwipeableMethods} from 'react-native-gesture-handler/ReanimatedSwipeable';
import {UserHabit} from "@/src/types/habits/UserHabit";
import {HabitListItemStyles} from '@/global';

interface HabitListItemProps {
    userHabit: UserHabit;
    isCompleted?: boolean;
    onComplete?: () => void;
    onUncomplete?: () => void;
    onEditHabit?: (id: number) => void;
}

export default function HabitListItem({
                                          userHabit,
                                          isCompleted = false,
                                          onComplete,
                                          onUncomplete,
                                          onEditHabit
                                      }: HabitListItemProps) {

    if (!userHabit || !userHabit.habit) {
        return null;
    }

    const {habit, streak} = userHabit;
    const swipeableRef = useRef<SwipeableMethods>(null);

    const formatCategory = (cat: string) => {
        return cat.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const renderLeftActions = () => {
        return (
            <View style={HabitListItemStyles.leftActionContainer}>
                <Check size={24} color="white"/>
                <Text style={HabitListItemStyles.actionText}>Complete</Text>
            </View>
        );
    };

    const renderRightActions = () => {
        return (
            <View style={HabitListItemStyles.rightActionContainer}>
                <Text style={HabitListItemStyles.actionText}>Undo</Text>
                <RotateCcw size={24} color="white"/>
            </View>
        );
    };

    const handleOpen = (direction: 'left' | 'right') => {
        console.log('=== SWIPE OPEN ===');
        console.log('Direction:', direction);
        console.log('isCompleted:', isCompleted);

        // Zamknij swipeable
        swipeableRef.current?.close();

        // Wykonaj akcję
        setTimeout(() => {
            if (direction === 'right' && !isCompleted) {
                console.log('Calling onComplete!');
                onComplete?.();
            } else if (direction === 'left' && isCompleted) {
                console.log('Calling onUncomplete!');
                onUncomplete?.();
            } else {
                console.log('NO ACTION - conditions not met');
            }
        }, 100);
    };

    return (
        <View style={HabitListItemStyles.container}>
            <Swipeable
                ref={swipeableRef}
                friction={2}
                leftThreshold={40}
                rightThreshold={40}
                renderLeftActions={!isCompleted ? renderLeftActions : undefined}
                renderRightActions={isCompleted ? renderRightActions : undefined}
                onSwipeableOpen={handleOpen}
            >
                <Pressable
                    onPress={() => onEditHabit?.(userHabit.id)}
                    style={[
                        HabitListItemStyles.habitCard,
                        {
                            backgroundColor: habit.hex_color || '#3B82F6',
                            opacity: isCompleted ? 0.9 : 1
                        }
                    ]}
                >
                    <View style={HabitListItemStyles.cardContent}>
                        <View style={HabitListItemStyles.leftSection}>
                            <View style={HabitListItemStyles.emojiContainer}>
                                <Text style={HabitListItemStyles.emoji}>{habit.emoji}</Text>
                            </View>

                            <View style={HabitListItemStyles.textContainer}>
                                <Text style={HabitListItemStyles.habitName} numberOfLines={1}>{habit.name}</Text>
                                {habit.category && (
                                    <View style={HabitListItemStyles.categoryBadge}>
                                        <Text style={HabitListItemStyles.categoryText}>
                                            {formatCategory(habit.category)}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        <View style={HabitListItemStyles.rightSection}>
                            <View style={HabitListItemStyles.streakContainer}>
                                <Flame size={14} color="white" fill={streak > 0 ? "white" : "transparent"}/>
                                <Text style={HabitListItemStyles.streakText}>{streak}</Text>
                            </View>

                            {isCompleted && (
                                <View style={HabitListItemStyles.checkmarkCircle}>
                                    <Check size={16} color={habit.hex_color || '#3B82F6'}/>
                                </View>
                            )}
                        </View>
                    </View>
                </Pressable>
            </Swipeable>
        </View>
    );
}

