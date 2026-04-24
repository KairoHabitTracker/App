import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeMode, ThemeColors } from '@/src/contexts/ThemeContext';
import { useScreenStyles } from '@/src/styles/screenStyles';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { ChevronLeft, Lightbulb } from '@tamagui/lucide-icons';

export default function SmartInsights() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useThemeMode();
  const s = useScreenStyles();
  const styles = useThemedStyles(createStyles);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for correlation engine
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const InsightCard = ({ text }: { text: string }) => (
    <View style={styles.card}>
      <View style={styles.iconWrapper}>
        <Lightbulb size={24} color="#F59E0B" />
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );

  return (
    <View style={[s.screen, { paddingTop: insets.top }]}>
      <View style={s.topBar}>
        <TouchableOpacity style={s.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.topBarTitle}>Smart Insights</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={s.centerContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={{ marginTop: 12, color: colors.subtleText }}>Analyzing patterns...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
          <InsightCard text="When you complete 'Morning Stretch', you are 42% more likely to complete all your daily habits." />
          <InsightCard text="You're most consistent on Tuesdays. Great job keeping the mid-week momentum alive!" />
          <InsightCard text="After missing a day, you usually bounce back immediately. Your resilience is strong." />
        </ScrollView>
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: colors.text,
  }
});
