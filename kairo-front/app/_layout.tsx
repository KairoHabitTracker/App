import React, {useEffect} from 'react';
import {TamaguiProvider} from '@tamagui/core';
import {Stack} from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import {AuthProvider} from '@/src/contexts/AuthContext';
import {config} from '@/tamagui.config';
import {HabitsProvider} from '@/src/contexts/HabitsContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ThemeProvider, useThemeMode} from '@/src/contexts/ThemeContext';

function AppShell() {
    const {colors} = useThemeMode();

    useEffect(() => {
        SystemUI.setBackgroundColorAsync(colors.background).catch(() => undefined);
    }, [colors.background]);

    return (
        <TamaguiProvider config={config}>
            <AuthProvider>
                <HabitsProvider>
                    <Stack>
                        <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                        <Stack.Screen name="habit" options={{headerShown: false}}/>
                        <Stack.Screen
                            name="settings"
                            options={{
                                title: 'Settings',
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name="profile/edit"
                            options={{
                                title: 'Edit profile',
                                headerBackTitle: 'Profile',
                            }}
                        />
                    </Stack>
                </HabitsProvider>
            </AuthProvider>
        </TamaguiProvider>
    );
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <ThemeProvider>
                <AppShell/>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}