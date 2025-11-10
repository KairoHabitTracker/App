import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text, XStack, YStack } from 'tamagui';
import { useAuth } from '@/src/contexts/AuthContext';

export default function SettingsScreen() {
    const { logout, logoutAll, user } = useAuth();
    const router = useRouter();
    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <YStack style={{ padding: 16, flex: 1, backgroundColor: '#ffffff' }}>
            <Text style={{ fontSize: 24, fontWeight: '700' }}>Settings</Text>

            {/* Account */}
            <YStack style={{ marginTop: 20 }}>
                <Text style={{ color: '#6b6b6b', fontSize: 12 }}>Account</Text>
                <XStack style={{ marginTop: 8, justifyContent: 'space-between', alignItems: 'center' }}>
                    <YStack>
                        <Text style={{ fontWeight: '600' }}>{user ? user.username : 'Not signed in'}</Text>
                        <Text style={{ color: '#6b6b6b', fontSize: 12 }}>{(user as any)?.email ?? ''}</Text>
                    </YStack>
                    <Button aria-label="Edit profile" onPress={() => router.push('../profile/edit')}>
                        Edit
                    </Button>
                </XStack>
            </YStack>

            {/* Connections & Integrations */}
            <YStack style={{ marginTop: 24 }}>
                <Text style={{ color: '#6b6b6b', fontSize: 12 }}>Connections</Text>
                <YStack style={{ marginTop: 8, gap: 8 }}>
                    <Button aria-label="Manage connections" onPress={() => router.push('../settings/connections')}>
                        Manage connections (Samsung Health, Google Fit...)
                    </Button>
                    <Text style={{ color: '#6b6b6b', fontSize: 12 }}>
                        Configure data types to read/write and sync options.
                    </Text>
                </YStack>
            </YStack>

            {/* Notifications */}
            <YStack style={{ marginTop: 24 }}>
                <Text style={{ color: '#6b6b6b', fontSize: 12 }}>Notifications & Reminders</Text>
                <YStack style={{ marginTop: 8, gap: 8 }}>
                    <Button aria-label="Manage reminders" onPress={() => router.push('../settings/notifications')}>
                        Reminders & schedules
                    </Button>
                    <Text style={{ color: '#6b6b6b', fontSize: 12 }}>
                        Control push reminders, daily digests and quiet hours.
                    </Text>
                </YStack>
            </YStack>

            {/* Appearance */}
            <YStack style={{ marginTop: 24 }}>
                <Text style={{ color: '#6b6b6b', fontSize: 12 }}>Appearance</Text>
                <XStack style={{ marginTop: 8, gap: 8 }}>
                    <Button aria-label="Light theme" onPress={() => { /* placeholder */ }}>
                        Light
                    </Button>
                    <Button aria-label="Dark theme" onPress={() => { /* placeholder */ }}>
                        Dark
                    </Button>
                    <Button aria-label="System theme" onPress={() => { /* placeholder */ }}>
                        System
                    </Button>
                </XStack>
                <Text style={{ color: '#6b6b6b', fontSize: 12, marginTop: 8 }}>Font size and contrast options</Text>
            </YStack>

            {/* Privacy & Security */}
            <YStack style={{ marginTop: 24 }}>
                <Text style={{ color: '#6b6b6b', fontSize: 12 }}>Privacy & Security</Text>
                <YStack style={{ marginTop: 8, gap: 8 }}>
                    <Button aria-label="Change password" onPress={() => router.push('../settings/security')}>
                        Change password / 2FA
                    </Button>
                    <Button aria-label="Export data" onPress={() => { /* placeholder export */ }}>
                        Export data (CSV/JSON)
                    </Button>
                    <Button aria-label="Delete account" onPress={() => { /* placeholder delete flow */ }} style={{ backgroundColor: '#e53935', color: '#fff' }}>
                        Delete account
                    </Button>
                </YStack>
            </YStack>

            {/* About & Support */}
            <YStack style={{ marginTop: 24 }}>
                <Text style={{ color: '#6b6b6b', fontSize: 12 }}>About</Text>
                <YStack style={{ marginTop: 8 }}>
                    <Text>Version: 0.1.0</Text>
                    <Button aria-label="Open help" onPress={() => router.push('../settings/about')} style={{ marginTop: 8 }}>
                        Help & support
                    </Button>
                </YStack>
            </YStack>

            {/* Logout area */}
            <YStack style={{ marginTop: 32 }}>
                <Button aria-label="Log out" onPress={() => { logout(); router.replace('/login'); }}>
                    Log out
                </Button>

                <Button aria-label="Log out from all devices" onPress={() => setConfirmOpen(true)} style={{ backgroundColor: '#e53935', color: '#fff', marginTop: 8 }}>
                    Log out from all devices
                </Button>
            </YStack>

            {/* Confirm modal for logout all - re-used from previous implementation */}
            {confirmOpen ? (
                <YStack style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, justifyContent: 'center', alignItems: 'center' }}>
                    <YStack style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} />

                    <YStack style={{ width: 320, padding: 16, backgroundColor: '#ffffff', borderRadius: 12, elevation: 2 }}>
                        <Text style={{ fontWeight: '700', fontSize: 16 }}>Confirm log out from all devices</Text>
                        <Text style={{ marginTop: 8 }}>{`This will sign you out of every device where you're logged in. Are you sure?`}</Text>

                        <XStack style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                            <Button onPress={() => setConfirmOpen(false)} variant="outlined">Cancel</Button>
                            <Button onPress={async () => { setConfirmOpen(false); await logoutAll(); router.replace('/login'); }} style={{ backgroundColor: '#e53935', color: '#fff' }}>
                                Confirm
                            </Button>
                        </XStack>
                    </YStack>
                </YStack>
            ) : null}

            <Button onPress={() => router.push('../profile')} style={{ marginTop: 24 }} accessibilityLabel="Go back to profile">
                Go Back
            </Button>
        </YStack>
    );
}
