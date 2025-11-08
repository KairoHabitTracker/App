import { useRouter } from 'expo-router';
import { Button, Text, YStack } from 'tamagui';

export default function ConnectionsScreen() {
  const router = useRouter();

  return (
    <YStack style={{ padding: 16, flex: 1, backgroundColor: '#ffffff' }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Connections</Text>
      <Text style={{ marginTop: 8, color: '#6b6b6b' }}>Connect external apps and services (Samsung Health, Google Fit, Apple Health).</Text>

      <Text style={{ marginTop: 16 }}>Placeholder: list of available integrations and connect buttons will go here.</Text>

      <Button aria-label="Back to settings" onPress={() => router.back()} style={{ marginTop: 24 }}>
        Back
      </Button>
    </YStack>
  );
}
