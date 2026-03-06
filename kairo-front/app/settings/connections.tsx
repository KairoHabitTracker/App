import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {useThemeMode} from '@/src/contexts/ThemeContext';
import {useScreenStyles} from '@/src/styles/screenStyles';

const STATUS_CARDS = [
  {
    title: 'Samsung Health',
    status: 'Looking to implement',
    description:
      'Working on the integration flow to sync habit data from Samsung Health into the app.',
  },
  {
    title: 'Apple Health',
    status: 'Looking to implement',
    description:
      'Integration coming soon! We are building the connection to pull in activity streaks from Apple Health.',
  },
  {
    title: 'Google Fit',
    status: 'Looking to implement',
    description: 'Stay tuned for Google Fit integration to sync your habit progress seamlessly.',
  },
];

export default function ConnectionsScreen() {
  const {colors} = useThemeMode();
  const s = useScreenStyles();

  return (
    <View style={s.screen}>
      <ScrollView contentContainerStyle={[s.scrollContent, {gap: 16}]}>
        <Text style={[s.headerTitle, {fontSize: 28}]}>Connections</Text>
        <Text style={[s.itemSubtext, {lineHeight: 22, fontSize: 15}]}>
          Integration with third party health platforms is in the works! Stay tuned for updates as
          we roll out new connectors to sync your habit data seamlessly.
        </Text>

        <View
          style={[
            s.card,
            {borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface},
          ]}>
          <Text
            style={[s.itemTitle, {fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase'}]}>
            Work in progress
          </Text>
          <Text style={[s.itemSubtext, {lineHeight: 20, marginTop: 4}]}>
            We&apos;ll try to add the integration in the next stretch of updates (hopefully) You can
            still browse what we&apos;re trying to bring to you though!
          </Text>
        </View>

        {STATUS_CARDS.map(card => (
          <View key={card.title} style={s.card}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={s.itemTitle}>{card.title}</Text>
              <Text
                style={[s.itemSubtext, {color: colors.accent, fontWeight: '600', fontSize: 13}]}>
                {card.status}
              </Text>
            </View>
            <Text style={[s.itemSubtext, {lineHeight: 20}]}>{card.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
