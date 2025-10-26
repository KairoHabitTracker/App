import { router, useLocalSearchParams as useSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { profileStyles as styles } from '../../global';
import { useAuth } from '../../src/contexts/AuthContext';
import { registerRequest } from '../../src/lib/api';

export default function RegisterScreen() {
	const { redirect } = useSearchParams() as { redirect?: string };
	const { login } = useAuth(); // Use login() to store token if backend returns one
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

async function onSubmit(): Promise<void> {
    setError(null);
    setLoading(true);

    try {
        const response: any = await registerRequest(email, password, 'mobile');

        const token = response?.token ?? response?.data?.token;
		if (token) {
			// Reminder to give devices actual names
			await login(email, password, 'mobile');
			// After login, go to requested redirect or home
			if (redirect) router.replace(redirect as any);
			else router.replace('/');
		} else {
            // backend may require email verification: show informative message and redirect to login
            router.replace(
                `/login?showVerify=1&email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(
                    redirect ?? '/'
                )}`
            );
        }
    } catch (error: any) {
        // If apiFetch throws, it sets error.body to parsed response when possible
        console.error('Register error', error);

        const body = error?.body;
        if (body?.errors) {
            // Flatten messages from validation errors for readability
            const messages = Object.values(body.errors).flat().join(' ');
            setError(messages);
        } else if (body?.message) {
            setError(body.message);
        } else {
            setError(error?.message || 'Registration failed');
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
					router.push(`/login?redirect=${encodeURIComponent(redirect ?? '/')}`)
				}
			>
				<Text style={styles.subtle}>Already have an account? Log in</Text>
			</TouchableOpacity>
		</View>
	);
}
