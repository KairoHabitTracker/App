import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {ThemeColors, useThemeMode} from '@/src/contexts/ThemeContext';

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
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Connections</Text>
        <Text style={styles.subtitle}>
          Integration with third party health platforms is in the works! Stay tuned for updates as
          we roll out new connectors to sync your habit data seamlessly.
        </Text>

        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>Work in progress</Text>
          <Text style={styles.calloutBody}>
            We&apos;ll try to add the integration in the next stretch of updates (hopefully) You can
            still browse what we&apos;re trying to bring to you though!
          </Text>
        </View>

        {STATUS_CARDS.map(card => (
          <View key={card.title} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardStatus}>{card.status}</Text>
            </View>
            <Text style={styles.cardDescription}>{card.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
      lineHeight: 22,
      color: colors.subtleText,
    },
    callout: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: 16,
    },
    calloutTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
      letterSpacing: 0.5,
    },
    calloutBody: {
      fontSize: 14,
      color: colors.subtleText,
      lineHeight: 20,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 18,
      gap: 8,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: colors.background === '#0F172A' ? 0.35 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    cardStatus: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.accent,
    },
    cardDescription: {
      fontSize: 14,
      color: colors.subtleText,
      lineHeight: 20,
    },
  });
