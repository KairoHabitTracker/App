import {Stack} from 'expo-router';
import {TamaguiProvider} from '@tamagui/core'
import {config} from '../tamagui.config'

export default function RootLayout() {
    return (
        <TamaguiProvider config={config}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                <Stack.Screen
                    name="add-habit"
                    options={{
                        title: 'Add Habit',
                        headerBackTitle: 'Back',

                    }}
                />
            </Stack>

        </TamaguiProvider>

    );
}
