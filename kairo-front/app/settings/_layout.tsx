import {router, Stack} from 'expo-router';
import {Pressable, Text} from "react-native";
import {ChevronLeft} from "@tamagui/lucide-icons";

export default function SettingsLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Settings',
                    // headerBackTitle: 'Profile',
                    // headerShown: true
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
                            >Profile</Text>
                        </Pressable>
                    ),
                }}
            />
            <Stack.Screen name="about"
                          options={{
                              title: 'About',
                              headerBackTitle: 'Settings',
                          }}/>
            <Stack.Screen name="connections"
                          options={{
                              title: 'Connections',
                              headerBackTitle: 'Settings',
                          }}/>
            <Stack.Screen name="notifications"
                          options={{
                              title: 'Notifications',
                              headerBackTitle: 'Settings',
                          }}/>
            <Stack.Screen name="security"
                          options={{
                              title: 'Security',
                              headerBackTitle: 'Settings',
                          }}/>
        </Stack>
    );
}
