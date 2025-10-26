import { TamaguiProvider } from '@tamagui/core';
import { Stack } from 'expo-router';
import { AuthProvider } from '../src/contexts/AuthContext';
import { config } from '../tamagui.config';

export default function RootLayout() {
    return (
        <TamaguiProvider config={config}>
            <AuthProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                </Stack>
            </AuthProvider>
        </TamaguiProvider>

    );
}
