import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text, XStack, YStack } from 'tamagui';
import { useAuth } from '../src/contexts/AuthContext';

export default function SettingsScreen() {
  const { logout, logoutAll, user } = useAuth();
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <YStack style={{ padding: 16, flex: 1, backgroundColor: '#ffffff' }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Settings</Text>

      <YStack style={{ marginTop: 16 }}>
        <Text style={{ color: '#6b6b6b', fontSize: 12 }}>Account</Text>
        <Text style={{ marginTop: 8 }}>{user ? user.username : 'Not signed in'}</Text>
      </YStack>

      <YStack style={{ marginTop: 24 }}>
        <Text style={{ color: '#6b6b6b', fontSize: 12 }}>Preferences (placeholders)</Text>
        <YStack style={{ marginTop: 8 }}>
          <Text>• Placeholder option A</Text>
          <Text>• Placeholder option B</Text>
          <Text>• Placeholder option C</Text>
        </YStack>
      </YStack>

      <YStack style={{ marginTop: 32 }}>
        <Button onPress={() => { logout(); }}>
          Log out
        </Button>

        <Button onPress={() => setConfirmOpen(true)} style={{ backgroundColor: '#e53935', color: '#fff', marginTop: 8 }}>
          Log out from all devices
        </Button>
      </YStack>

      {confirmOpen ? (
        <YStack style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, justifyContent: 'center', alignItems: 'center' }}>
          <YStack style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} />

          <YStack style={{ width: 320, padding: 16, backgroundColor: '#ffffff', borderRadius: 12, elevation: 2 }}>
            <Text style={{ fontWeight: '700', fontSize: 16 }}>Confirm log out from all devices</Text>
            <Text style={{ marginTop: 8 }}>This will sign you out of every device where you're logged in. Are you sure?</Text>

            <XStack style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              <Button onPress={() => setConfirmOpen(false)} variant="outlined">Cancel</Button>
              <Button onPress={async () => { setConfirmOpen(false); await logoutAll(); router.replace('/login'); }} style={{ backgroundColor: '#e53935', color: '#fff' }}>
                Confirm
              </Button>
            </XStack>
          </YStack>
        </YStack>
        
      ) : null}
      <Text style={{ marginTop: 32, color: 'black', fontSize: 40 }}>Placeholder - only logout works</Text>
      <Button onPress={() => router.push('../profile')} style={{ marginTop: 24 }}>
        Go Back
      </Button>
    </YStack>
    
  );
}
