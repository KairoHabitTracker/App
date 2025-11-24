import { profileStyles as styles } from '@/global';
import { useAuth } from '@/src/contexts/AuthContext';
import { router, useLocalSearchParams as useSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
    const { login } = useAuth();
    const { redirect } = useSearchParams() as { redirect?: string };
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit() {
        setError(null);
        setLoading(true);
        try {
            await login(email, password, 'mobile');
            // Redirect to requested page or home
            if (redirect) router.replace(redirect as any);
            else router.replace('/home');
        } catch (error: unknown) {
            console.error('Login error', error);
            const body = (error as { body?: unknown }).body;
            if (body && typeof body === 'object' && 'errors' in (body as Record<string, unknown>)) {
                const errors = (body as Record<string, unknown>)['errors'] as unknown;
                try {
                    const messages = Object.values(errors as Record<string, string[]>).flat().join(' ');
                    setError(messages);
                } catch {
                    setError('Login failed');
                }
            } else if (body && typeof body === 'object' && 'message' in (body as Record<string, unknown>)) {
                setError(String((body as Record<string, unknown>)['message']));
            } else if (typeof (error as { message?: unknown }).message === 'string') {
                setError((error as { message?: string }).message ?? 'Login failed');
            } else {
                setError('Login failed');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={[styles.container, styles.center]}>
            <Text style={styles.username}>Log in</Text>
            {error ? <Text style={styles.subtle}>{error}</Text> : null}
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={{ width: '100%', padding: 12, marginVertical: 8, backgroundColor: '#fff', borderRadius: 8 }}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={{ width: '100%', padding: 12, marginVertical: 8, backgroundColor: '#fff', borderRadius: 8 }}
                secureTextEntry
            />

            <TouchableOpacity onPress={onSubmit} disabled={loading} style={{ marginTop: 12 }}>
                <Text style={styles.statValue}>{loading ? 'Logging in...' : 'Log in'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push(`/register?redirect=${encodeURIComponent(redirect ?? '/home')}`)}>
                <Text style={styles.subtle}>Don't have an account? Register</Text>
            </TouchableOpacity>
        </View>
    );
}
