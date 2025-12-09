import {TamaguiProvider} from '@tamagui/core';
import {Stack} from 'expo-router';
import {AuthProvider} from '@/src/contexts/AuthContext';
import {config} from '@/tamagui.config';
import {HabitsProvider} from "@/src/contexts/HabitsContext";
import {GestureHandlerRootView} from 'react-native-gesture-handler';


export default function RootLayout() {
    return (
        <GestureHandlerRootView>

            <TamaguiProvider config={config}>
                <AuthProvider>
                    <HabitsProvider>
                        <Stack>
                            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                            <Stack.Screen name="habit" options={{headerShown: false}}/>
                            <Stack.Screen name="settings"
                                          options={{
                                              title: 'Settings',
                                              headerShown: false,
                                          }}/>
                            <Stack.Screen name="profile/edit"
                                          options={{
                                              title: 'Edit profile',
                                              headerBackTitle: 'Profile',
                                          }}/>
                        </Stack>
                    </HabitsProvider>
                </AuthProvider>
            </TamaguiProvider>
        </GestureHandlerRootView>

    );
}