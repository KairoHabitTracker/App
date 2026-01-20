import {profileStyles as styles} from '@/global';
import {registerRequest} from '@/src/lib/api';
import {router, useLocalSearchParams as useSearchParams} from 'expo-router';
import {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';

export default function RegisterScreen() {
    const { redirect } = useSearchParams() as { redirect?: string };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(): Promise<void> {
        setError(null);
        setLoading(true);

        try {
            await registerRequest(email, password, 'mobile');

            router.replace(
                `/login?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirect ?? '/home')}`
            );

        } catch (err: any) {
            let message = 'Registration failed.';

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
            <Text style={styles.username}>Register</Text>

            {error ? (
                <Text style={[styles.subtle, {color: '#ef4444', marginBottom: 15, textAlign: 'center'}]}>
                    {error}
                </Text>
            ) : null}

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