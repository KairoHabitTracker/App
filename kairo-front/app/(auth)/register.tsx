import {useAuth} from '@/src/contexts/AuthContext';
import {registerRequest} from '@/src/lib/api';
import {router, useLocalSearchParams as useSearchParams} from 'expo-router';
import {useState} from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {ScrollView} from "tamagui";
import {AlertCircle, Lock, Mail} from "@tamagui/lucide-icons";
import {profileStyles, sharedFonts, sharedStyles} from "@/global";

export default function RegisterScreen() {
    const {redirect} = useSearchParams() as { redirect?: string };
    const {login} = useAuth(); // Use login() to store token if backend returns one
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
                else router.replace('/home');
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
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                keyboardShouldPersistTaps="handled"
            >
                <View style={[sharedStyles.basicContainer, {marginTop: 64}]}>
                    <View style={profileStyles.container}>
                        <View style={styles.header}>
                            <Text style={sharedFonts.headerText}>Create Account</Text>
                            <Text style={sharedFonts.mediumSubtleText}>Start your habit tracking journey today</Text>
                        </View>

                        {error && (
                            <View style={styles.errorContainer}>
                                <AlertCircle size={20} color="#DC2626"/>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email</Text>
                                <View style={styles.inputContainer}>
                                    <Mail size={20} color="#6B7280" style={styles.inputIcon}/>
                                    <TextInput
                                        placeholder="your@email.com"
                                        placeholderTextColor="#9CA3AF"
                                        value={email}
                                        onChangeText={setEmail}
                                        style={styles.input}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Password</Text>
                                <View style={styles.inputContainer}>
                                    <Lock size={20} color="#6B7280" style={styles.inputIcon}/>
                                    <TextInput
                                        placeholder="Min. 8 characters"
                                        placeholderTextColor="#9CA3AF"
                                        value={password}
                                        onChangeText={setPassword}
                                        style={styles.input}
                                        secureTextEntry
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Confirm Password</Text>
                                <View style={styles.inputContainer}>
                                    <Lock size={20} color="#6B7280" style={styles.inputIcon}/>
                                    <TextInput
                                        placeholder="Repeat password"
                                        placeholderTextColor="#9CA3AF"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        style={styles.input}
                                        secureTextEntry
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={onSubmit}
                                disabled={loading || !email || !password || !confirmPassword}
                                style={[
                                    styles.submitButton,
                                    (loading || !email || !password || !confirmPassword) && styles.submitButtonDisabled
                                ]}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white"/>
                                ) : (
                                    <Text style={styles.submitButtonText}>Create Account</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity
                                onPress={() => router.push(`/login?redirect=${encodeURIComponent(redirect ?? '/home')}`)}
                            >
                                <Text style={styles.footerLink}>Log In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    content: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logo: {
        fontSize: 64,
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        borderWidth: 1,
        borderColor: '#FCA5A5',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        gap: 12,
    },
    errorText: {
        flex: 1,
        fontSize: 15,
        color: '#DC2626',
        fontWeight: '500',
    },
    form: {
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: '#111827',
    },
    submitButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#3B82F6',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonDisabled: {
        backgroundColor: '#9CA3AF',
        shadowOpacity: 0,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 17,
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 15,
        color: '#6B7280',
    },
    footerLink: {
        fontSize: 15,
        fontWeight: '600',
        color: '#3B82F6',
    },
});