import { useRouter } from 'expo-router';
import { Button, Text, YStack } from 'tamagui';

export default function AboutSettings() {
  const router = useRouter();

  return (
    <YStack style={{ padding: 16, flex: 1, backgroundColor: '#ffffff' }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>About & Support</Text>
      <Text style={{ marginTop: 8, color: '#6b6b6b' }}>Help center, terms, privacy policy and app info.</Text>

      <Text style={{ marginTop: 16 }}>Placeholder: links to documentation and support contact will go here.</Text>

      <Button aria-label="Back to settings" onPress={() => router.back()} style={{ marginTop: 24 }}>
        Back
      </Button>
    </YStack>
  );
}
