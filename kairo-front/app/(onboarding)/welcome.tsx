import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {router} from 'expo-router';
import {useThemeMode} from '@/src/contexts/ThemeContext';

export default function WelcomeScreen() {
  const {colors} = useThemeMode();

  const handleStart = () => {
    router.push('/(onboarding)/age');
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.content}>
        <Text style={[styles.emoji, styles.largeEmoji]}>👋</Text>
        <Text style={[styles.title, {color: colors.text}]}>Witaj!</Text>
        <Text style={[styles.subtitle, {color: colors.subtleText}]}>
          Poznajmy się lepiej, aby stworzyć dla Ciebie
          {'\n'}
          spersonalizowane doświadczenie
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, {backgroundColor: colors.accent}]}
        onPress={handleStart}
        activeOpacity={0.8}
      >
        <Text style={[styles.buttonText, {color: colors.card}]}>Zaczynamy</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emoji: {
    marginBottom: 20,
  },
  largeEmoji: {
    fontSize: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
});


