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
    <View style={[styles.screen, styles.centerContainer]}>
      <View style={[styles.centerContainer]}>
        <Text style={{fontSize: 70, marginBottom: spacing.xl}}>👋</Text>
        <Text style={[styles.modalTitle, {color: colors.text, textAlign: 'center'}]}>Hi there!</Text>
        <Text style={[styles.headerSubtitle, {textAlign: 'center', maxWidth: 280, fontSize: 16}]}>
          Thank you for choosing Kairo!
          {'\n\n'}
          Let&apos;s get to know you better!!
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: colors.accent,
            marginBottom: spacing.xxl,
            alignItems: 'center',
            paddingVertical: spacing.md,
            width: '80%',
          }
        ]}
        onPress={handleStart}
        activeOpacity={0.8}
      >
        <Text style={[styles.itemTitle, {color: colors.card}]}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}




