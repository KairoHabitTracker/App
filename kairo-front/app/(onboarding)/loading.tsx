import React, {useEffect} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {router} from 'expo-router';
import {spacing, useScreenStyles} from '@/src/styles/screenStyles';
import {useThemeMode} from '@/src/contexts/ThemeContext';

export default function LoadingScreen() {
  const styles = useScreenStyles();
  const {colors} = useThemeMode();


  useEffect(() => {
    // Simulate loading for 2 seconds, then go to home
    const timer = setTimeout(() => {
      // TODO: Save onboarding data to backend when ready
      router.replace('/(tabs)/home');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={colors.accent} style={{marginBottom: spacing.xl}}/>
      <Text style={styles.screenTitle}>
        Preparing your personalized plan...
      </Text>
      <Text style={[styles.headerSubtitle, {marginTop: spacing.md}]}>
        This will only take a moment
      </Text>
    </View>
  );
}
