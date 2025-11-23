import {TamaguiProvider} from '@tamagui/core';
import {Stack} from 'expo-router';
import {AuthProvider} from '@/src/contexts/AuthContext';
import {config} from '@/tamagui.config';

export default function RootLayout() {
    return (
        <TamaguiProvider config={config}>
            <AuthProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                    <Stack.Screen name="settings"
                                  options={{
                                      title: 'Settings',
                                      // headerBackTitle: 'Profile',
                                      headerShown: false,
                                  }}/>
                    <Stack.Screen name="profile/edit"
                                  options={{
                                      title: 'Edit profile',
                                      headerBackTitle: 'Profile',
                                  }}/>
                    <Stack.Screen
                        name="habit"
                        options={{
                            title: 'Add Habit',
                            headerBackTitle: 'Back',

                        }}
                    />
            </Stack>
            </AuthProvider>
        </TamaguiProvider>

    );
}
