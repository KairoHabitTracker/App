import {router, Stack} from 'expo-router';
import {Pressable, Text} from "react-native";
import {ChevronLeft} from "@tamagui/lucide-icons";

export default function HabitLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="add/index"
                options={{
                    title: 'Add Habit',
                    presentation: 'card',
                    headerLeft: () => (
                        <Pressable
                            onPress={() => router.back()}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                                paddingRight: 8
                            }}
                            hitSlop={8}
                        >
                            <ChevronLeft size={24}/>
                            <Text
                                style={{
                                    fontSize: 17,
                                    fontWeight: '500',
                                }}
                            >Back</Text>
                        </Pressable>
                    ),
                }}
            />
            <Stack.Screen
                name="add/[habitId]"
                options={{
                    title: 'Habit Details',
                }}
            />
            <Stack.Screen
                name="edit/[userHabitId]"
                options={{
                    title: 'Edit Habit Notifications',
                    headerLeft: () => (
                        <Pressable
                            onPress={() => router.back()}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                                paddingRight: 8
                            }}
                            hitSlop={8}
                        >
                            <ChevronLeft size={24}/>
                            <Text
                                style={{
                                    fontSize: 17,
                                    fontWeight: '500',
                                }}
                            >Back</Text>
                        </Pressable>
                    ),
                }}
            />
        </Stack>
    );
}