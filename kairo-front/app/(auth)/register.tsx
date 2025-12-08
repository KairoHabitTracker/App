import { profileStyles as styles } from '@/global';
import { useAuth } from '@/src/contexts/AuthContext';
import { registerRequest, sendVerificationNotification } from '@/src/lib/api';
import { router, useLocalSearchParams as useSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
    const { redirect } = useSearchParams() as { redirect?: string };
    const { loginWithToken } = useAuth(); // save token and fetch profile when backend returns one
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(): Promise<void> {
        setError(null);
        setLoading(true);

        try {
            const response = await registerRequest(email, password, 'mobile');

            const token = response?.token ?? response.data?.token;
            if (token) {
                // Save token, fetch profile and navigate
                await loginWithToken(token, redirect);
                // Trigger verification email (server will use the token stored in secure store)
                try {
                    await sendVerificationNotification();
                    // navigate to a friendly 'verification sent' screen
                    router.replace({ pathname: '/verify-sent', params: { email: encodeURIComponent(email) } } as any);
                    return;
                } catch (err) {
                    // Non-fatal: still show verification-sent screen but include note
                    console.warn('Failed to send verification notification', err);
                    router.replace({ pathname: '/verify-sent', params: { email: encodeURIComponent(email), note: encodeURIComponent('Failed to send verification email, please try resend from login.') } } as any);
                    return;
                }
            } else {
                // Backend did not return a token. Navigate to login and instruct user to check email.
                router.replace(
                    `/login?showVerify=1&email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(
                        redirect ?? '/'
                    )}`
                );
            }
        } catch (error: unknown) {
            // If apiFetch throws, it sets error.body to parsed response when possible
            console.error('Register error', error);
            const body = (error as { body?: unknown }).body;
            if (body && typeof body === 'object' && 'errors' in (body as Record<string, unknown>)) {
                const errs = (body as Record<string, unknown>)['errors'] as unknown;
                if (errs && typeof errs === 'object') {
                    // try to flatten if it's a Record<string, string[]>
                    try {
                        const messages = Object.values(errs as Record<string, string[]>).flat().join(' ');
                        setError(messages);
                    } catch {
                        setError('Registration failed');
                    }
                } else {
                    setError('Registration failed');
                }
            } else if (body && typeof body === 'object' && 'message' in (body as Record<string, unknown>)) {
                setError(String((body as Record<string, unknown>)['message']));
            } else if (typeof (error as { message?: unknown }).message === 'string') {
                setError((error as { message?: string }).message ?? 'Registration failed');
            } else {
                setError('Registration failed');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={[styles.container, styles.center]}>
            <Text style={styles.username}>Register</Text>
            {error ? <Text style={styles.subtle}>{error}</Text> : null}
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={{
                    width: '100%',
                    padding: 12,
                    marginVertical: 8,
                    backgroundColor: '#fff',
                    borderRadius: 8,
                }}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={{
                    width: '100%',
                    padding: 12,
                    marginVertical: 8,
                    backgroundColor: '#fff',
                    borderRadius: 8,
                }}
                secureTextEntry
            />

            <TouchableOpacity
                onPress={onSubmit}
                disabled={loading}
                style={{ marginTop: 12 }}
            >
                <Text style={styles.statValue}>
                    {loading ? 'Registering...' : 'Register'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() =>
                        router.push(`/login?redirect=${encodeURIComponent(redirect ?? '/home')}`)
                    }
            >
                <Text style={styles.subtle}>Already have an account? Log in</Text>
            </TouchableOpacity>
        </View>
    );
}
