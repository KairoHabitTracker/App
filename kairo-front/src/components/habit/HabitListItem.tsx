import {Animated, PanResponder, Text, View} from "react-native";
import {UserHabit} from "@/src/types/UserHabit";
import {useRef} from "react";
import {Check, RotateCcw} from "@tamagui/lucide-icons";
import {progressCardStyles, sharedFonts} from "@/global";

interface HabitListItemProps {
    userHabit: UserHabit;
    isCompleted?: boolean;
    onComplete?: () => void;
    onUncomplete?: () => void;
}

export default function HabitListItem({
                                          userHabit,
                                          isCompleted = false,
                                          onComplete,
                                          onUncomplete
                                      }: HabitListItemProps) {
    const { habit } = userHabit;
    const translateX = useRef(new Animated.Value(0)).current;
    const SWIPE_THRESHOLD = 80;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dx) > 10;
            },
            onPanResponderMove: (_, gestureState) => {
                if (isCompleted && gestureState.dx < 0) {
                    // Swipe left to uncomplete
                    translateX.setValue(gestureState.dx);
                } else if (!isCompleted && gestureState.dx > 0) {
                    // Swipe right to complete
                    translateX.setValue(gestureState.dx);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (isCompleted && gestureState.dx < -SWIPE_THRESHOLD) {
                    Animated.timing(translateX, {
                        toValue: -200,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => {
                        onUncomplete?.();
                        translateX.setValue(0);
                    });
                } else if (!isCompleted && gestureState.dx > SWIPE_THRESHOLD) {
                    Animated.timing(translateX, {
                        toValue: 200,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => {
                        onComplete?.();
                        translateX.setValue(0);
                    });
                } else {
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    return (
        <View style={progressCardStyles.container}>
            {!isCompleted && (
                <View style={[progressCardStyles.actionBg, progressCardStyles.actionBgComplete]}>
                    <Check size={24} color="white" />
                    <Text style={[sharedFonts.mediumText, {color: 'white'}]}>Complete</Text>
                </View>
            )}
            {isCompleted && (
                <View style={[progressCardStyles.actionBg, progressCardStyles.actionBgUndo]}>
                    <Text style={[sharedFonts.mediumWhiteText]}>Undo</Text>
                    <RotateCcw size={24} color="white" />
                </View>
            )}

            {/* Swipeable Card */}
            <Animated.View
                style={[
                    progressCardStyles.habitCard,
                    {
                        backgroundColor: habit.hex_color || '#3B82F6',
                        transform: [{ translateX }],
                        opacity: isCompleted ? 0.6 : 1,
                    }
                ]}
                {...panResponder.panHandlers}
            >
                <View style={progressCardStyles.habitContent}>
                    <View style={progressCardStyles.emojiContainer}>
                        <Text style={sharedFonts.mediumEmoji}>{habit.emoji}</Text>
                    </View>
                    <View>
                        <Text style={sharedFonts.mediumWhiteText}>{habit.name}</Text>
                        {habit.category && (
                            <Text style={[sharedFonts.smallWhiteText, { textTransform: 'capitalize'}]}>{habit.category}</Text>
                        )}
                    </View>
                    {isCompleted && (
                        <View style={progressCardStyles.checkmark}>
                            <Check size={20} color="white" />
                        </View>
                    )}
                </View>
            </Animated.View>
        </View>
    );
}

