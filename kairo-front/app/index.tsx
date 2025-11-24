import { getItemAsync } from '@/src/lib/secureStore';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const token = await getItemAsync('authToken');
                if (!mounted) return;
                // Redirect to the actual home tab /home
                // Redirecting to '/' here causes issues with looping navigation from other screens that used
                // `/` as redirect after login/register.
                router.replace((token ? '/home' : '/login') as any);
            } catch (e) {
                router.replace('/login' as any);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [router]);

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator/>
        </View>
    );
}