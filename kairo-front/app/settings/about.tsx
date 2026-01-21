import React, {useMemo} from 'react';
import {Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Constants from 'expo-constants';
import {ThemeColors, useThemeMode} from '@/src/contexts/ThemeContext';

const SUPPORT_ENTRIES = [
  {
    title: 'Contact support',
    description: 'Email us if you hit a bug or need general help.',
    action: () => Linking.openURL('mailto:miodexpp@gmail.com'),
    cta: 'Email us at miodexpp@gmail.com',
  },
  {
    title: 'Product roadmap',
    description: 'Track what we are building next, including connections and achievements.',
    action: () => Linking.openURL('https://github.com/KairoHabitTracker/KairoHabitTracker'),
    cta: 'View roadmap',
  },
  {
    title: 'Community Discord',
    description: 'Share feedback with the team and other habit builders.',
    action: () => Linking.openURL('https://discord.gg/maybe-our-future-beekeeping-server'),
    cta: 'Coming soon',
  },
];

export default function AboutSettings() {
  const {colors} = useThemeMode();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const version = Constants.expoConfig?.version ?? '0.1.0';

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>About & Support</Text>
        <Text style={styles.subtitle}>
          Need help? You can reach out to us below!
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Version</Text>
          <Text style={styles.cardValue}>{version}</Text>
          <Text style={styles.cardDescription}>Latest build shipped January 2026.</Text>
        </View>

        {SUPPORT_ENTRIES.map((entry) => (
          <TouchableOpacity key={entry.title} style={styles.card} onPress={entry.action}>
            <Text style={styles.cardTitle}>{entry.title}</Text>
            <Text style={styles.cardDescription}>{entry.description}</Text>
            <Text style={styles.cardCta}>{entry.cta}</Text>
          </TouchableOpacity>
        ))}
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
    gap: 16,
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
    padding: 18,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: colors.background === '#0F172A' ? 0.35 : 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.subtleText,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.subtleText,
    lineHeight: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  cardCta: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
  },
});
