import {useAuth} from '@/src/contexts/AuthContext';
import {useThemeMode} from '@/src/contexts/ThemeContext';
import {useAuthStyles} from '@/src/styles/authStyles';
import {router, useLocalSearchParams as useSearchParams} from 'expo-router';
import {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';


export default function LoginScreen() {
  const {login} = useAuth();
  const params = useSearchParams() as { redirect?: string, email?: string };
  const {colors} = useThemeMode();
  const styles = useAuthStyles();

  const [email, setEmail] = useState(params.email || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      await login(email, password, 'mobile');
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
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>Log in</Text>

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

        <TouchableOpacity onPress={onSubmit} disabled={loading} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>{loading ? 'Logging in...' : 'Log in'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/register?redirect=${encodeURIComponent(params.redirect ?? '/home')}`)}>
          <Text style={styles.link}>Don&#39;t have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
