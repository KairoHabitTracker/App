import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {router} from 'expo-router';
import {spacing, useScreenStyles} from '@/src/styles/screenStyles';
import {useThemeMode} from '@/src/contexts/ThemeContext';

export default function NameScreen() {
  const styles = useScreenStyles();
  const {colors} = useThemeMode();
  const [name, setName] = useState('');

  const handleNext = () => {
    if (name.trim()) {
      router.push({
        pathname: '/(onboarding)/age',
        params: {name: name.trim()},
      });
    }
  };


  const isValid = name.trim().length > 0;

  return (
    <View style={styles.screen}>
      <View style={styles.centerContainer}>
        <Text style={styles.screenTitle}>What&apos;s your name?</Text>
        <Text style={[styles.headerSubtitle, {marginTop: spacing.md, marginBottom: spacing.xxl}]}>
          We&apos;d love to know what to call you
        </Text>

        <TextInput
          style={[
            styles.input,
            {borderColor: isValid ? colors.accent : colors.border},
          ]}
          placeholder="Enter your name"
          placeholderTextColor={colors.subtleText}
          value={name}
          onChangeText={setName}
        />
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
