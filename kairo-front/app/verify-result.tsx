import { profileStyles as styles } from '@/global';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function VerifyResult() {
  const { status, message } = useLocalSearchParams() as { status?: string; message?: string };

  let title = 'Verification';
  let subtitle = '';
  if (status === 'success') {
    title = 'Email Verified';
    subtitle = 'Thank you — your email has been verified.';
  } else if (status === 'invalid') {
    title = 'Invalid Link';
    subtitle = 'The verification link appears to be invalid. You can request a new verification email from the login screen.';
  } else if (status === 'error') {
    title = 'Verification Error';
    subtitle = message ? String(message) : 'An unexpected error occurred during verification.';
  }

  return (
    <View style={[styles.container, styles.center]}>
      <Text style={styles.username}>{title}</Text>
      <Text style={[styles.subtle, { marginTop: 12, textAlign: 'center' }]}>{subtitle}</Text>

      <TouchableOpacity
        onPress={() => router.replace('/login')}
        style={{ marginTop: 20 }}
      >
        <Text style={styles.statValue}>Return to login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace('/home')}
        style={{ marginTop: 12 }}
      >
        <Text style={styles.subtle}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}
