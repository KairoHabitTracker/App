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
    onEditHabit?: (id: number) => void;
}

export default function HabitListItem({
                                          userHabit,
                                          isCompleted = false,
                                          onComplete,
                                          onUncomplete,
                                          onEditHabit
                                      }: HabitListItemProps) {
    const {habit} = userHabit;
    const translateX = useRef(new Animated.Value(0)).current;
    const SWIPE_THRESHOLD = 80;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dx) > 10;
            },
            onPanResponderMove: (_, gestureState) => {
                if (isCompleted && gestureState.dx < 0) {
                    // Swipe left to uncomplete (tylko dla ukończonych)
                    translateX.setValue(gestureState.dx);
                } else if (!isCompleted && gestureState.dx > 0) {
                    // Swipe right to complete (tylko dla nieukończonych)
                    translateX.setValue(gestureState.dx);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                const isClick = Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5;

                if (isClick) {
                    // Wywołaj funkcję przekazaną z góry, przekazując ID powiązania użytkownika (userHabit.id)
                    onEditHabit?.(userHabit.id);

                    // Zawsze zresetuj po kliknięciu
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                        friction: 7,
                        tension: 100,
                    }).start();
                    return;
                }
                if (isCompleted && gestureState.dx < -SWIPE_THRESHOLD) {
                    // Uncomplete: przesunięcie w lewo > threshold
                    Animated.timing(translateX, {
                        toValue: -200, // Przesuń poza ekran w lewo
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => {
                        // toValue: -200 (wizualnie "usuwa" element)
                        onUncomplete?.();
                    });
                } else if (!isCompleted && gestureState.dx > SWIPE_THRESHOLD) {
                    // Complete: przesunięcie w prawo > threshold
                    Animated.timing(translateX, {
                        toValue: 200, // Przesuń poza ekran w prawo
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => {
                        onComplete?.();
                    });
                } else {
                    // Bounce back jeśli threshold nie osiągnięty
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                        friction: 7,
                        tension: 100,
                    }).start();
                }
            },
        })
    ).current;

    return (
        <View style={progressCardStyles.container}>

            {!isCompleted && (
                <View style={[progressCardStyles.actionBg, progressCardStyles.actionBgComplete]}>
                    <Check size={24} color="white"/>
                    <Text style={[sharedFonts.mediumText, {color: 'white'}]}>Complete</Text>
                </View>
            )}
            {isCompleted && (
                <View style={[progressCardStyles.actionBg, progressCardStyles.actionBgUndo]}>
                    <Text style={[sharedFonts.mediumWhiteText]}>Undo</Text>
                    <RotateCcw size={24} color="white"/>
                </View>
            )}

            {/* Swipeable Card */}
            <Animated.View
                style={[
                    progressCardStyles.habitCard,
                    {
                        backgroundColor: habit.hex_color || '#3B82F6',
                        transform: [{translateX}],
                    }
                ]}
                {...panResponder.panHandlers}
            >
                <View>
                    {/*<Pressable*/}
                    {/*    style={{flexDirection: 'row', alignItems: 'center', flex: 1}}*/}
                    {/*>*/}
                    <View style={progressCardStyles.emojiContainer}>
                        <Text style={sharedFonts.mediumEmoji}>{habit.emoji}</Text>
                    </View>
                    <View style={[progressCardStyles.actionBg, {
                        justifyContent: 'space-between',
                        paddingLeft: 55
                    }]}>
                        <View>
                            <Text style={sharedFonts.mediumWhiteText}>{habit.name}</Text>
                            {habit.category && (
                                <Text
                                    style={[sharedFonts.smallWhiteText, {textTransform: 'capitalize'}]}>{habit.category}</Text>
                            )}
                        </View>

                        {isCompleted && (
                            <>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: 4
                                }}>
                                    <Text style={sharedFonts.smallWhiteText}>Completed</Text>
                                    <View style={progressCardStyles.checkmark}>
                                        <Check size={20} color="white"/>
                                    </View>
                                </View>

                            </>

                        )}
                    </View>

                    {/*</Pressable>*/}
                </View>
            </Animated.View>
        </View>
    );
}

