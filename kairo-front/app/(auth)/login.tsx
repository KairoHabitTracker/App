import {profileStyles as styles} from '@/global';
import {useAuth} from '@/src/contexts/AuthContext';
import {router, useLocalSearchParams as useSearchParams} from 'expo-router';
import {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';

export default function LoginScreen() {
    const { login } = useAuth();
    const params = useSearchParams() as { redirect?: string, email?: string };

    const [email, setEmail] = useState(params.email || '');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit() {
        setError(null);
        setLoading(true);
        try {
            await login(email, password, 'mobile');
            if (params.redirect) router.replace(params.redirect as any);
            else router.replace('/home');
        } catch (err: any) {
            let message = 'Login failed. Please try again.';

            if (err?.body?.errors) {
                try {
                    const allErrors = Object.values(err.body.errors).flat();
                    message = allErrors.join('\n');
                } catch {
                    message = 'Validation error occurred.';
                }
            } else if (err?.body?.message) {
                message = err.body.message;
            } else if (err?.message) {
                message = err.message;
            }

            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={[styles.container, styles.center]}>
            <Text style={styles.username}>Log in</Text>

            {error ? (
                <Text style={[styles.subtle, {color: '#ef4444', marginBottom: 15, textAlign: 'center'}]}>
                    {error}
                </Text>
            ) : null}

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

            <TouchableOpacity
                onPress={() => router.push(`/register?redirect=${encodeURIComponent(params.redirect ?? '/home')}`)}>
                <Text style={styles.subtle}>Don&#39;t have an account? Register</Text>
            </TouchableOpacity>
        </View>
    );
}