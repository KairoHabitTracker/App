import React, {useState} from 'react';
import {ActivityIndicator, ScrollView, Text, TouchableOpacity, View,} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';
import {spacing, useScreenStyles} from '@/src/styles/screenStyles';
import {useThemeMode} from '@/src/contexts/ThemeContext';

const INTERESTS = [
  {id: 'health', label: 'Health & Fitness', emoji: '💪'},
  {id: 'mindfulness', label: 'Mindfulness & Mental Health', emoji: '🧘'},
  {id: 'learning', label: 'Learning & Development', emoji: '📚'},
  {id: 'productivity', label: 'Productivity', emoji: '⚡'},
  {id: 'creativity', label: 'Creativity', emoji: '🎨'},
  {id: 'relationships', label: 'Relationships', emoji: '❤️'},
];


export default function InterestsScreen() {
  const styles = useScreenStyles();
  const {colors} = useThemeMode();
  const {name} = useLocalSearchParams<{ name: string }>();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleNext = async () => {
    if (loading || selected.length === 0) return;

    setLoading(true);
    try {
      router.push({
        pathname: '/(onboarding)/habits',
        params: {name, interests: selected.join(',')},
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.screen, styles.centerContainer]}>
      <View style={[styles.topBar, {height: 80}]}></View>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>

        <View style={{paddingHorizontal: spacing.xl, paddingVertical: spacing.lg}}>
          <Text style={styles.headerTitle}>What interests you most?</Text>
          <Text style={[styles.headerSubtitle, {marginTop: spacing.md, marginBottom: spacing.xxl}]}>
            Select areas you&apos;d like to focus on
          </Text>

          <View style={{gap: spacing.md}}>
            {INTERESTS.map(interest => (
              <TouchableOpacity
                key={interest.id}
                style={[
                  styles.row,
                  {
                    backgroundColor: selected.includes(interest.id)
                      ? colors.accent
                      : colors.card,
                    borderWidth: selected.includes(interest.id) ? 0 : 1,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => toggleInterest(interest.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.itemTitle, {marginRight: spacing.md}]}>{interest.emoji}</Text>
                <Text
                  style={[
                    styles.itemTitle,
                    {
                      color: selected.includes(interest.id)
                        ? colors.card
                        : colors.text,
                    },
                  ]}
                >
                  {interest.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[{gap: spacing.md, width: '100%'}]}>
        <Text style={[styles.itemSubtext, {textAlign: 'center'}]}>
          Selected: {selected.length}
        </Text>
        <TouchableOpacity
          style={[
            styles.card,
            {
              marginBottom: spacing.xxl,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: spacing.md,
              width: '80%',
              backgroundColor: selected.length === 0 ? colors.mutedAccent : colors.accent
            },
          ]}
          onPress={handleNext}
          disabled={selected.length === 0 || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={colors.card}/>
          ) : (
            <Text
              style={[
                styles.itemTitle,
                {
                  color: selected.length === 0 ? colors.text : colors.card,
                  textAlign: 'center',
                },
              ]}
            >
              Next
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
