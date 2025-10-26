import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { profileStyles as styles } from '../../../global';

type Props = {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

export default function LoadingError({ loading, error, onRetry }: Props) {
  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="small" />
        <Text style={styles.subtle}>Loading…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.subtle}>{error}</Text>
        {onRetry ? (
          <TouchableOpacity onPress={onRetry}>
            <Text style={styles.statValue}>Retry</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  return null;
}
