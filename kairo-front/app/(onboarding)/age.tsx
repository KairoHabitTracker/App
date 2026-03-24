import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';
import {spacing, useScreenStyles} from '@/src/styles/screenStyles';
import {useThemeMode} from '@/src/contexts/ThemeContext';

export default function AgeScreen() {
  const styles = useScreenStyles();
  const {colors} = useThemeMode();
  const {name} = useLocalSearchParams<{ name: string }>();
  const [age, setAge] = useState('');

  const handleNext = () => {
    if (age.trim() && !isNaN(parseInt(age))) {
      router.push({
        pathname: '/(onboarding)/interests',
        params: {name, age},
      });
    }
  };

  const isValid = age.trim() && !isNaN(parseInt(age)) && parseInt(age) > 0 && parseInt(age) < 150;

  return (
    <View style={styles.screen}>
      <TouchableOpacity onPress={() => router.back()} style={{paddingHorizontal: spacing.xl, paddingTop: spacing.xl}}>
        <Text style={[styles.link, {marginTop: 0}]}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.centerContainer}>
        <Text style={styles.screenTitle}>How old are you?</Text>
        <Text style={[styles.headerSubtitle, {marginTop: spacing.md, marginBottom: spacing.xxl}]}>
          This helps us personalize your experience
        </Text>

        <TextInput
          style={[
            styles.input,
            {borderColor: isValid ? colors.accent : colors.border},
          ]}
          placeholder="Enter your age"
          placeholderTextColor={colors.subtleText}
          keyboardType="number-pad"
          value={age}
          onChangeText={setAge}
          maxLength={3}
        />


        {age && !isValid && (
          <Text style={[styles.errorTitle, {marginTop: spacing.md}]}>
            Please enter a valid age (1-149)
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: isValid ? colors.accent : colors.mutedAccent,
            marginHorizontal: spacing.xl,
            marginBottom: spacing.xl,
          },
        ]}
        onPress={handleNext}
        disabled={!isValid}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.primaryButtonText,
            {color: isValid ? colors.card : colors.text, textAlign: 'center'},
          ]}
        >
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
}
