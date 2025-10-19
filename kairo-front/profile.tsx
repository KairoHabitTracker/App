import Feather from '@expo/vector-icons/Feather';
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { profileStyles as styles } from "../styles/global";



// Minimal shape for user profile data; replace fetchUserProfile with a real API call later
type UserProfile = {
    username: string;
    streak: number; 
    coins: number;
    avatarUrl?: string; // optional, placeholder used if absent
    subscription?: string; // optional, user's subscription level
};

async function fetchUserProfile(): Promise<UserProfile> {
    // TODO: Replace with API call from backend later
    // not this static shit
    return {
        username: "Kairo",
        streak: 14,
        coins: 30,
        // We have to decide if we allow users to upload avatars, add letter initials as avatar or if we
        // use Kairo avatars from a selection??
        avatarUrl: "https://api.dicebear.com/9.x/identicon/svg?seed=Kairo",
        subscription: "Free" // Free / Premium
    };
}

export default function Profile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        fetchUserProfile().then(setProfile).catch(() => {
            // placeholder if fetch fails
            setProfile({ username: "Guest", streak: 0, coins: 0, subscription: "Free" });
        });
    }, []);

    if (!profile) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.subtle}>Loading profile…</Text>
            </View>
        );
    }

    const { username, streak, coins, avatarUrl, subscription } = profile;

    return (
        
        <View style={styles.container}>
            <View style={[styles.header, styles.center]}>
                {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <Text style={styles.avatarInitials}>
                            {(username || "?").slice(0, 1).toUpperCase()}
                        </Text>
                    </View>
                )}
                <Text style={styles.username}>{username}</Text>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Subscription</Text>
                    <Text style={styles.statValue}>{subscription || "Free"}</Text>
                </View>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Current Streak</Text>
                    <Text style={styles.statValue}>
                        {streak}
                        {(() => {
                            if (streak >= 30) return "🔥🔥🔥";
                            if (streak >= 14) return "🔥🔥";
                            if (streak >= 7) return "🔥";
                            if (streak === 1) return "⏳";
                            if (streak === 0) return "💀";
                            if (streak < 0) return "WAIT, HOW??";
                            return "";
                        })()}
                    </Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Coins</Text>
                    <Text style={styles.statValue}>{coins}🪙</Text>
                </View>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}><Feather name="settings" size={24} color="black" /> settings </Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}><Feather name="edit-2" size={24} color="black" /> Edit Profile</Text>
                </View>
            </View>
            <Text style={styles.statValue}>Jakieś wykresy tutaj, integracja z kalendarzem, consents, etc</Text>

        </View>
    );
}
