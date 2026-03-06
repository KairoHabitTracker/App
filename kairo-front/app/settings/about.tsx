import React from 'react';
import {Linking, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Constants from 'expo-constants';
import {useThemeMode} from '@/src/contexts/ThemeContext';
import {useScreenStyles} from '@/src/styles/screenStyles';

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
  const s = useScreenStyles();
  const version = Constants.expoConfig?.version ?? '0.1.0';

  return (
    <View style={s.screen}>
      <ScrollView contentContainerStyle={[s.scrollContent, {gap: 16}]}>
        <Text style={[s.headerTitle, {fontSize: 28}]}>About & Support</Text>
        <Text style={s.itemSubtext}>Need help? You can reach out to us below!</Text>

        <View style={s.card}>
          <Text style={s.sectionTitle}>Version</Text>
          <Text style={[s.statValue, {fontSize: 22}]}>{version}</Text>
          <Text style={s.itemSubtext}>Latest build shipped January 2026.</Text>
        </View>

        {SUPPORT_ENTRIES.map(entry => (
          <TouchableOpacity key={entry.title} style={s.card} onPress={entry.action}>
            <Text style={s.itemTitle}>{entry.title}</Text>
            <Text style={s.itemSubtext}>{entry.description}</Text>
            <Text style={[s.itemSubtext, {color: colors.accent, fontWeight: '600'}]}>
              {entry.cta}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
