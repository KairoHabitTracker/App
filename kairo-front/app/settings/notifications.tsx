import { useRouter } from 'expo-router';
import { Button, Text, YStack } from 'tamagui';

export default function NotificationsSettings() {
  const router = useRouter();

  return (
    <YStack style={{ padding: 16, flex: 1, backgroundColor: '#ffffff' }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Notifications & Reminders</Text>
      <Text style={{ marginTop: 8, color: '#6b6b6b' }}>Manage push notifications, reminders, quiet hours and digests.</Text>

      <Text style={{ marginTop: 16 }}>Placeholder: toggles and scheduling UI will go here.</Text>

      <Button aria-label="Back to settings" onPress={() => router.back()} style={{ marginTop: 24 }}>
        Back
      </Button>
    </YStack>
  );
}
