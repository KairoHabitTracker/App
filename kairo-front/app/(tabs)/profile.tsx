import React, {useEffect, useState} from "react";
import {ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useRouter} from 'expo-router';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {apiFetch} from '@/src/lib/api';
import {ApiProfileResponse} from '@/src/types/apiTypes';
import {UserProfile} from '@/src/types/types';
import {deleteItemAsync} from '@/src/lib/secureStore';

import ProfileAvatar from '@/src/components/ProfileAvatar';
import {ChevronRight, Coins, CreditCard, Edit2, Flame, List, Settings, TrendingUp} from "lucide-react-native";
import {sharedStyles} from "@/global";

const StatBox = ({icon: Icon, value, label, color}: any) => (
    <View style={styles.statBox}>
        <View style={[styles.statIconContainer, {backgroundColor: color + '20'}]}>
            <Icon size={20} color={color}/>
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const MenuItem = ({icon: Icon, title, onPress, color = "#111827"}: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.menuLeft}>
            <View style={[styles.menuIconBadge, {backgroundColor: '#F3F4F6'}]}>
                <Icon size={20} color={color}/>
            </View>
            <Text style={styles.menuText}>{title}</Text>
        </View>
        <ChevronRight size={20} color="#9CA3AF"/>
    </TouchableOpacity>
);

async function fetchUserProfile(): Promise<UserProfile> {
    const json: ApiProfileResponse = await apiFetch('/api/profile');
    const info = json.data?.info;
    return {
        id: json.data.id,
        username: info?.name ?? json.data.email ?? 'User',
        avatarUrl: info?.avatar_url ?? null,
        streak: info?.streak ?? 0,
        coins: info?.coins ?? 0,
        subscription: info?.subscription ?? "Free"
    };
}

export default function Profile() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const data = await fetchUserProfile();
            setProfile(data);
        } catch (error: any) {
            console.error("Profile load error", error);
            if (error.status === 401) {
                await deleteItemAsync('authToken');
                router.replace('/login');
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    if (loading) {
        return (
            <View style={[sharedStyles.basicContainer, {justifyContent: 'center', alignItems: 'center'}]}>
                <ActivityIndicator size="large" color="#3B82F6"/>
            </View>
        );
    }

    if (!profile) return null;

    const {username, streak, coins, avatarUrl, subscription} = profile;

    return (
        <View style={[sharedStyles.basicContainer, {paddingTop: insets.top}]}>
            <View style={styles.topBar}>
                <Text style={styles.topBarTitle}>Profile</Text>
            </View>

            <ScrollView
                contentContainerStyle={{paddingBottom: 40}}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <ProfileAvatar
                        username={username}
                        avatarUrl={avatarUrl}
                        size={100}
                        style={styles.avatarShadow}
                    />
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.userHandle}>@{username?.toLowerCase().replace(/\s/g, '')}</Text>
                </View>

                <View style={styles.statsContainer}>
                    <StatBox
                        icon={Flame}
                        value={streak}
                        label="Streak"
                        color="#F59E0B"
                    />
                    <View style={styles.verticalDivider}/>
                    <StatBox
                        icon={Coins}
                        value={coins}
                        label="Coins"
                        color="#EAB308"
                    />
                    <View style={styles.verticalDivider}/>
                    <StatBox
                        icon={CreditCard}
                        value={subscription}
                        label="Plan"
                        color="#3B82F6"
                    />
                </View>

                <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>Management</Text>
                </View>

                <View style={styles.menuContainer}>
                    <MenuItem
                        icon={List}
                        title="My Habits"
                        color="#3B82F6"
                        onPress={() => router.push('/habit/all')}
                    />
                    <View style={styles.menuDivider}/>

                    <MenuItem
                        icon={Edit2}
                        title="Edit Profile"
                        onPress={() => router.push('../profile/edit')}
                    />
                    <View style={styles.menuDivider}/>

                    <MenuItem
                        icon={Settings}
                        title="App Settings"
                        onPress={() => router.push('../settings')}
                    />
                </View>

                <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>Insights</Text>
                </View>

                <View style={styles.comingSoonCard}>
                    <View style={styles.comingSoonIcon}>
                        <TrendingUp size={24} color="white"/>
                    </View>
                    <View>
                        <Text style={styles.comingSoonText}>Advanced Analytics</Text>
                        <Text style={styles.comingSoonSubtext}>Charts and calendar coming soon!</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    topBar: {
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    topBarTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#111827',
    },
    header: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 24,
    },
    username: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginTop: 16,
    },
    userHandle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    avatarShadow: {
        shadowColor: "#3B82F6",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        backgroundColor: '#EFF6FF'
    },

    statsContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginHorizontal: 20,
        borderRadius: 16,
        paddingVertical: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 32,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    verticalDivider: {
        width: 1,
        height: '60%',
        backgroundColor: '#F3F4F6',
    },

    sectionTitleContainer: {
        paddingHorizontal: 24,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    menuContainer: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        borderRadius: 16,
        marginBottom: 24,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: 'white',
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuIconBadge: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1F2937',
    },
    menuDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginLeft: 56,
    },

    comingSoonCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8B5CF6',
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 20,
        gap: 16,
    },
    comingSoonIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    comingSoonText: {
        fontSize: 16,
        fontWeight: '700',
        color: 'white',
    },
    comingSoonSubtext: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
    },
});