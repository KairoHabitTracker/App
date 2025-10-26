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
		const response = await registerRequest(email, password, 'mobile');

	const token = response?.token ?? response.data?.token;
		if (token) {
			// Reminder to give devices actual names
			// After login, go to requested redirect or home
			if (redirect) router.replace(redirect as any);
			else router.replace('/');
		} else {
            // backend may require email verification: show informative message and redirect to login
            // router.replace(
            //     `/login?showVerify=1&email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(
            //         redirect ?? '/'
            //     )}`
            // );
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
					router.push(`/login?redirect=${encodeURIComponent(redirect ?? '/')}`)
				}
			>
				<Text style={styles.subtle}>Already have an account? Log in</Text>
			</TouchableOpacity>
		</View>
	);
}
