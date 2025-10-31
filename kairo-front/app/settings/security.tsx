import { useRouter } from 'expo-router';
import { Button, Text, YStack } from 'tamagui';

export default function SecuritySettings() {
  const router = useRouter();

  return (
    <YStack style={{ padding: 16, flex: 1, backgroundColor: '#ffffff' }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Privacy & Security</Text>
      <Text style={{ marginTop: 8, color: '#6b6b6b' }}>Change password, manage 2FA and view security events.</Text>

      <Text style={{ marginTop: 16 }}>Placeholder: password change form and 2FA setup UI will go here.</Text>

      <Button aria-label="Back to settings" onPress={() => router.back()} style={{ marginTop: 24 }}>
        Back
      </Button>
    </YStack>
  );
}
