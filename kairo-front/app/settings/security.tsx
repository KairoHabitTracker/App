import React, {useMemo, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {ThemeColors, useThemeMode} from '@/src/contexts/ThemeContext';
import {requestPasswordReset, resetPasswordWithToken, validatePasswordResetToken} from '@/src/lib/api';

export default function SecuritySettings() {
  const {colors} = useThemeMode();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingAction, setLoadingAction] = useState<'request' | 'reset' | null>(null);

  const handleRequestLink = async () => {
    if (!email.trim()) {
      Alert.alert('Missing email', 'Enter the email tied to your account.');
      return;
    }
    setLoadingAction('request');
    try {
      await requestPasswordReset(email.trim());
      Alert.alert('Email sent', 'Check your inbox for the password reset instructions.');
    } catch (error: any) {
      Alert.alert('Unable to send email', error?.message || 'Please try again later.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleResetPassword = async () => {
    if (!token.trim()) {
      Alert.alert('Missing token', 'Paste the reset token from your email.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Missing email', 'Enter the same email you used to request the reset.');
      return;
    }
    if (!password || password.length < 8) {
      Alert.alert('Password too short', 'Use at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Ensure both password fields are identical.');
      return;
    }

    setLoadingAction('reset');
    try {
      await validatePasswordResetToken(token.trim());
      await resetPasswordWithToken(token.trim(), {
        email: email.trim(),
        password,
        password_confirmation: confirmPassword,
      });
      Alert.alert('Password updated', 'You can now log in with your new password.');
      setPassword('');
      setConfirmPassword('');
      setToken('');
    } catch (error: any) {
      Alert.alert('Could not reset password', error?.message || 'Double-check the token and try again.');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Password & Security</Text>
        <Text style={styles.subtitle}>
          Currently not working, since we lost our server.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Request a reset link</Text>
          <Text style={styles.cardDescription}>
            Enter the email tied to your profile. We'll send you a code to your inbox to reset your password.
          </Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            placeholderTextColor={colors.subtleText}
          />
          <TouchableOpacity
            style={[styles.button, loadingAction === 'request' && styles.buttonDisabled]}
            disabled={loadingAction === 'request'}
            onPress={handleRequestLink}
          >
            <Text style={styles.buttonText}>
              {loadingAction === 'request' ? 'Sending…' : 'Send email'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Reset with token</Text>
          <Text style={styles.cardDescription}>
            Paste the code from the email, then set a new password.
          </Text>
          <TextInput
            placeholder="Reset token"
            value={token}
            onChangeText={setToken}
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor={colors.subtleText}
          />
          <TextInput
            placeholder="New password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor={colors.subtleText}
          />
          <TextInput
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor={colors.subtleText}
          />
          <TouchableOpacity
            style={[styles.button, loadingAction === 'reset' && styles.buttonDisabled]}
            disabled={loadingAction === 'reset'}
            onPress={handleResetPassword}
          >
            <Text style={styles.buttonText}>
              {loadingAction === 'reset' ? 'Updating…' : 'Update password'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.subtleText,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: colors.background === '#0F172A' ? 0.35 : 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.subtleText,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
