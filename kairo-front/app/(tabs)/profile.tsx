// Libraries
import {router} from 'expo-router';
import {useEffect, useState} from "react";
import {Text, TouchableOpacity, View} from "react-native";

// Styles
import {profileStyles as styles} from "@/global";

// Api
import {apiFetch} from '@/src/lib/api';
import {ApiProfileResponse} from '@/src/types/apiTypes';

import {UserProfile} from '@/src/types/types';

// Token Storage
import {deleteItemAsync} from '@/src/lib/secureStore';

// Components
import AuthButton from '@/src/components/AuthButton';
import LoadingError from '@/src/components/LoadingError';
import ProfileAvatar from '@/src/components/ProfileAvatar';
import StatCard from '@/src/components/StatCard';
import {Feather} from "@expo/vector-icons";


// Fetch user profile
async function fetchUserProfile(): Promise<UserProfile> {
    const json: ApiProfileResponse = await apiFetch('/api/profile');

    const info = json.data?.info;
    const username = info?.name ?? json.data.email ?? 'User';
    const avatarUrl = info?.avatar_url ?? null;
    const streak = info?.streak ?? 0;
    const coins = info?.coins ?? 0;
    const subscription = info?.subscription ?? "Free";

    return {
        username,
        avatarUrl,
        streak,
        coins,
        subscription
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
                        router.replace('/login');
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
        return <LoadingError loading/>;
    }

    // If there's an error, we also prompt a re-login (just like invalid token case above)
    if (error) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.subtle}>{error}</Text>
                <AuthButton
                    title="Log in"
                    onPress={() => {
                        deleteItemAsync('authToken').then(() => router.replace('/login'));
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

    const {username, streak, coins, avatarUrl, subscription} = profile;

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
                <ProfileAvatar username={username} avatarUrl={avatarUrl}/>
                <Text style={styles.username}>{username}</Text>
            </View>

            <View style={styles.statsRow}>
                <StatCard label="Subscription" value={subscription || "Free"}/>
            </View>

            <View style={styles.statsRow}>
                <StatCard label="Current Streak" value={`${streak}${streakBadge}`}/>
                <StatCard label="Coins" value={`${coins}🪙`}/>
            </View>

            <View style={styles.statsRow}>
                <TouchableOpacity
                    style={styles.statCard}
                    onPress={() => router.push('../settings')}
                >
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                        <Feather name="settings" size={20} color="black"/>
                        <Text style={styles.statValue}>Settings</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.statCard}
                    onPress={() => router.push('../profile/edit')}
                >
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                        <Feather name="edit-2" size={20} color="black"/>
                        <Text style={styles.statValue}>Edit Profile</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Placeholder reminder for future stats */}
            {/*<Text style={styles.statValue}>*/}
            {/*    Jakieś wykresy tutaj, integracja z kalendarzem, consents, etc*/}
            {/*</Text>*/}
        </View>
    );
}