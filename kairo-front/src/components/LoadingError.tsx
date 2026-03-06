// Libraries
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type Props = {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

export default function LoadingError({loading, error, onRetry}: Props) {
    if (loading) {
        return (
          <View style={styles.container}>
            <ActivityIndicator size="small" />
            <Text style={styles.subtle}>Loading…</Text>
          </View>
        );
    }

    if (error) {
        return (
          <View style={styles.container}>
            <Text style={styles.subtle}>{error}</Text>
            {onRetry ? (
              <TouchableOpacity onPress={onRetry}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  subtle: {
    color: '#6B7280',
    fontSize: 14,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
});
