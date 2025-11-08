import React, {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useRouter} from 'expo-router';
import {getItemAsync} from '@/src/lib/secureStore';

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const token = await getItemAsync('authToken');
                if (!mounted) return;
                router.replace((token ? '/' : '/login') as any);
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