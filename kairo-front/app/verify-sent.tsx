import { profileStyles as styles } from '@/global';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function VerifySent() {
  const { email, note } = useLocalSearchParams() as { email?: string; note?: string };
  const decodedEmail = email ? decodeURIComponent(String(email)) : undefined;
  const decodedNote = note ? decodeURIComponent(String(note)) : undefined;

  return (
    <View style={[styles.container, styles.center]}>
      <Text style={styles.username}>Verification Sent</Text>
      <Text style={[styles.subtle, { marginTop: 12, textAlign: 'center' }]}>We sent a verification email{decodedEmail ? ` to ${decodedEmail}` : ''}.</Text>
      {decodedNote ? <Text style={[styles.subtle, { marginTop: 8, textAlign: 'center' }]}>{decodedNote}</Text> : null}

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
        <Text style={styles.subtle}>Go to home (if already logged in)</Text>
      </TouchableOpacity>
    </View>
  );
}
