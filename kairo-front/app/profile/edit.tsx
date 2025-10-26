// Libraries
import { useRouter } from 'expo-router';
import { Button, Text, YStack } from 'tamagui';

export default function EditProfileScreen() {
  const router = useRouter();

  return (
    <YStack style={{ padding: 16, flex: 1, backgroundColor: '#ffffff' }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Edit Profile</Text>
      <Text style={{ marginTop: 16 }}>This is a placeholder for the Edit Profile screen.</Text>
      <Button onPress={() => router.push('../profile')} style={{ marginTop: 24 }}>
        Go Back
      </Button>
    </YStack>
  );
}
