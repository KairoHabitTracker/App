import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { profileStyles as styles } from "../../global";
import { deleteItemAsync, getItemAsync } from '../../src/lib/secureStore';
import AuthButton from '../components/shared/AuthButton';
import LoadingError from '../components/shared/LoadingError';
import ProfileAvatar from '../components/shared/ProfileAvatar';
import StatCard from '../components/shared/StatCard';

type ApiProfileInfo = {
    id: number;
    user_id: number;
    name: string | null;
    avatar_url?: string | null;
    streak: number;
    coins: number;
};

type ApiProfileData = {
    id: number;
    email: string;
    email_verified_at?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    info?: ApiProfileInfo | null;
};

type ApiProfileResponse = {
    data: ApiProfileData;
};

type UserProfile = {
    username: string;
    streak: number;
    coins: number;
    avatarUrl?: string | null;
    subscription?: string;
};

// Get token from secure storage
async function getSavedToken(): Promise<string | null> {
    try {
        const token = await getItemAsync('authToken');
        return token;
    } catch (e) {
        console.warn("Failed to read token from SecureStore", e);
        return null;
    }
}

// Fetch user profile from API using token
async function fetchUserProfile(): Promise<UserProfile> {
    const token = await getSavedToken();

    if (!token) {
        throw new Error("No auth token available");
    }

    const res = await fetch('https://kairo.iru.codes/api/profile', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        const err = new Error(
            `Failed to fetch profile: ${res.status} ${res.statusText} ${text}`
        );
        (err as any).status = res.status;
        throw err;
    }

    const json: ApiProfileResponse = await res.json();

    // Map API response into UI-friendly shape
    const info = json.data?.info;
    const username = info?.name ?? json.data.email ?? "User";
    const avatarUrl = info?.avatar_url ?? null;
    const streak = info?.streak ?? 0;
    const coins = info?.coins ?? 0;

    return {
        username,
        avatarUrl,
        streak,
        coins,
        // Placeholder until we have real subscription data? Or just a meme, dunno
        subscription: "Free",
    };
}

export default function Profile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        (async () => {
            setLoading(true);
            setError(null);

            try {
                const profile = await fetchUserProfile();
                if (mounted) {
                    setProfile(profile);
                }
            } catch (error: any) {
                console.error("Profile load error", error);
                if (mounted) {
                    if (error.status === 401) {
                        // Invalid token
                        // Tokens don't expire, but new one is created upon new login, so old one won't work
                        // Plus we might add bans later or whatever (that's a requirement for app store)
                        await deleteItemAsync('authToken');
                        setError("Session error. Please log in again.");
                        setProfile(null);
                        router.push('/login');
                    } else if (error.message === "No auth token available") {
                        setError("Not logged in. Please log in to see your profile.");
                    } else {
                        setError("Failed to load profile. Please try again.");
                    }
                }
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    if (loading) {
        return <LoadingError loading />;
    }

    // If there's an error, we also prompt a re-login (just like invalid token case above)
    if (error) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.subtle}>{error}</Text>
                <AuthButton
                    title="Log in"
                    onPress={() => {
                        deleteItemAsync('authToken').then(() => router.push('/login'));
                    }}
                />
            </View>
        );
    }

    // If profile is still null, show a message
    if (!profile) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.subtle}>No profile available</Text>
            </View>
        );
    }

    const { username, streak, coins, avatarUrl, subscription } = profile;

    // Determine streak badge (I dunno if we keep this or not)
    // I ain't draving a 5 svgs for this lol
    const streakBadge =
        streak >= 30
            ? '🔥🔥🔥'
            : streak >= 14
            ? '🔥🔥'
            : streak >= 7
            ? '🔥'
            : streak === 1
            ? '⏳'
            : streak === 0
            ? '💀'
            : streak < 0
            ? 'WAIT, HOW??'
            : '';

    return (
        <View style={styles.container}>
            <View style={[styles.header, styles.center]}>
                <ProfileAvatar username={username} avatarUrl={avatarUrl} />
                <Text style={styles.username}>{username}</Text>
            </View>

            <View style={styles.statsRow}>
                <StatCard label="Subscription" value={subscription || 'Free'} />
            </View>

            <View style={styles.statsRow}>
                <StatCard label="Current Streak" value={`${streak}${streakBadge}`} />
                <StatCard label="Coins" value={`${coins}🪙`} />
            </View>

            <View style={styles.statsRow}>
                <StatCard
                    value={
                        <>
                            <Feather name="settings" size={20} color="black" /> settings
                        </>
                    }
                    onPress={() => router.push('../settings')}
                />
                <StatCard
                    value={
                        <>
                            <Feather name="edit-2" size={20} color="black" /> Edit Profile
                            
                        </>
                    }
                    onPress={() => router.push('../profile/edit')}
                />
            </View>

            {/* Placeholder reminder for future stats */}
            <Text style={styles.statValue}>
                Jakieś wykresy tutaj, integracja z kalendarzem, consents, etc
            </Text>
        </View>
    );
}