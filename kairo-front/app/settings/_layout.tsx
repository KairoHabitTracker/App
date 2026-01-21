import {Stack, useRouter} from 'expo-router';
import {Pressable, Text} from 'react-native';
import {ChevronLeft} from '@tamagui/lucide-icons';
import {useThemeMode} from '@/src/contexts/ThemeContext';

export default function SettingsLayout() {
    const router = useRouter();
    const {colors} = useThemeMode();

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)/profile');
        }
    };

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.card,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                    color: colors.text,
                },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: 'Settings',
                    // headerBackTitle: 'Profile',
                    // headerShown: true
                    headerLeft: () => (
                        <Pressable
                            onPress={handleBack}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                                paddingRight: 8,
                            }}
                            hitSlop={8}
                        >
                            <ChevronLeft size={24} color={colors.text as any}/>
                            <Text
                                style={{
                                    fontSize: 17,
                                    fontWeight: '500',
                                    color: colors.text,
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
