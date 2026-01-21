import {registerRequest} from '@/src/lib/api';
import {useThemeMode} from '@/src/contexts/ThemeContext';
import {useAuthStyles} from '@/src/styles/authStyles';
import {router, useLocalSearchParams as useSearchParams} from 'expo-router';
import {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';

export default function RegisterScreen() {
    const { redirect } = useSearchParams() as { redirect?: string };
    const { colors } = useThemeMode();
    const styles = useAuthStyles();

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
        <View style={styles.screen}>
            <View style={styles.content}>
                <Text style={styles.title}>Register</Text>

                {error ? (
                    <Text style={styles.error}>
                        {error}
                    </Text>
                ) : null}

                <TextInput
                    placeholder="Email"
                    placeholderTextColor={colors.subtleText}
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    placeholder="Password"
                    placeholderTextColor={colors.subtleText}
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    secureTextEntry
                />

                <TouchableOpacity
                    onPress={onSubmit}
                    disabled={loading}
                    style={styles.primaryButton}
                >
                    <Text style={styles.primaryButtonText}>
                        {loading ? 'Registering...' : 'Register'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        router.push(`/login?redirect=${encodeURIComponent(redirect ?? '/home')}`)
                    }
                >
                    <Text style={styles.link}>Already have an account? Log in</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}