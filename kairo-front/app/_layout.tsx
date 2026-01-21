import React, {useEffect, useMemo} from 'react';
import {TamaguiProvider} from '@tamagui/core';
import {Stack} from 'expo-router';
import {View} from 'react-native';
import * as SystemUI from 'expo-system-ui';
import {AuthProvider} from '@/src/contexts/AuthContext';
import {config} from '@/tamagui.config';
import {HabitsProvider} from "@/src/contexts/HabitsContext";
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ThemeProvider, useThemeMode} from '@/src/contexts/ThemeContext';

function AppShell() {
    const {colorScheme, colors} = useThemeMode();

    useEffect(() => {
        SystemUI.setBackgroundColorAsync(colors.background).catch(() => {
            // no-op in dev if system ui module is unavailable
        });
    }, [colors.background]);

    const screenOptions = useMemo(() => ({
        contentStyle: {backgroundColor: colors.background},
        headerStyle: {backgroundColor: colors.card},
        headerTintColor: colors.text,
        headerTitleStyle: {color: colors.text},
    }), [colors]);

    return (
        <TamaguiProvider config={config} defaultTheme={colorScheme}>
            <AuthProvider>
                <HabitsProvider>
                    <View style={{flex: 1, backgroundColor: colors.background}}>
                        <Stack screenOptions={screenOptions}>
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
                    </View>
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