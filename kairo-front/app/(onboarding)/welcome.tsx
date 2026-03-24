import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {router} from 'expo-router';
import {spacing, useScreenStyles} from '@/src/styles/screenStyles';
import {useThemeMode} from '@/src/contexts/ThemeContext';

export default function WelcomeScreen() {
  const styles = useScreenStyles();
  const {colors} = useThemeMode();

  const handleStart = () => {
    router.push('/(onboarding)/name');
  };

  return (
    <View style={[styles.screen, {padding: spacing.xl, justifyContent: 'space-between'}]}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.lg}}>
        <Text style={{fontSize: 80, marginBottom: spacing.xl}}>👋</Text>
        <Text style={[styles.screenTitle, {color: colors.text, textAlign: 'center'}]}>Welcome!</Text>
        <Text style={[styles.headerSubtitle, {textAlign: 'center', maxWidth: 280, fontSize: 16}]}>
          Let&apos;s get to know you better to create a
          {'\n'}
          personalized experience for you
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: colors.accent,
            marginBottom: spacing.xl,
            alignItems: 'center',
            paddingVertical: spacing.md,
          }
        ]}
        onPress={handleStart}
        activeOpacity={0.8}
      >
        <Text style={[styles.itemTitle, {color: colors.card, fontWeight: '700'}]}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}




