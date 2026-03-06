import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
// import {
//   requestPasswordReset,
//   resetPasswordWithToken,
//   validatePasswordResetToken,
// } from '@/src/lib/api';
import {useThemeMode} from '@/src/contexts/ThemeContext';
import {useScreenStyles} from '@/src/styles/screenStyles';

export default function SecuritySettings() {
  const {colors} = useThemeMode();
  const s = useScreenStyles();

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
      Alert.alert(
        'Could not reset password',
        error?.message || 'Double-check the token and try again.',
      );
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <View style={s.screen}>
      <ScrollView contentContainerStyle={[s.scrollContent, {gap: 20}]}>
        <Text style={[s.headerTitle, {fontSize: 28}]}>Password & Security</Text>
        <Text style={s.itemSubtext}>Currently not working, since we lost our server.</Text>

        <View style={s.card}>
          <Text style={[s.itemTitle, {fontSize: 18}]}>Request a reset link</Text>
          <Text style={[s.itemSubtext, {lineHeight: 20}]}>
            Enter the email tied to your profile. We&apos;ll send you a code to your inbox to reset
            your password.
          </Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={[s.input, {backgroundColor: colors.surface}]}
            placeholderTextColor={colors.subtleText}
          />
          <TouchableOpacity
            style={[
              styles.button,
              {backgroundColor: colors.accent},
              loadingAction === 'request' && styles.buttonDisabled,
            ]}
            disabled={loadingAction === 'request'}
            onPress={handleRequestLink}>
            <Text style={styles.buttonText}>
              {loadingAction === 'request' ? 'Sending…' : 'Send email'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={s.card}>
          <Text style={[s.itemTitle, {fontSize: 18}]}>Reset with token</Text>
          <Text style={[s.itemSubtext, {lineHeight: 20}]}>
            Paste the code from the email, then set a new password.
          </Text>
          <TextInput
            placeholder="Reset token"
            value={token}
            onChangeText={setToken}
            autoCapitalize="none"
            style={[s.input, {backgroundColor: colors.surface}]}
            placeholderTextColor={colors.subtleText}
          />
          <TextInput
            placeholder="New password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={[s.input, {backgroundColor: colors.surface}]}
            placeholderTextColor={colors.subtleText}
          />
          <TextInput
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={[s.input, {backgroundColor: colors.surface}]}
            placeholderTextColor={colors.subtleText}
          />
          <TouchableOpacity
            style={[
              styles.button,
              {backgroundColor: colors.accent},
              loadingAction === 'reset' && styles.buttonDisabled,
            ]}
            disabled={loadingAction === 'reset'}
            onPress={handleResetPassword}>
            <Text style={styles.buttonText}>
              {loadingAction === 'reset' ? 'Updating…' : 'Update password'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
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
