import React from 'react';
import {Image, Text, View} from 'react-native';
import {useFriendsStyles} from '@/src/styles/friendsStyles';
import {Friend} from "@/src/types/friends/Friend";

interface FriendListItemProps {
    friend: Friend;
    getAvatarUrl: (url: string | null) => string | null;
}

export const FriendListItem = ({friend, getAvatarUrl}: FriendListItemProps) => {
    const styles = useFriendsStyles();

    return (
        <View style={styles.cardRow}>
            <View style={styles.avatarContainer}>
                {friend.info?.avatar_url ? (
                    <Image
                        source={{uri: getAvatarUrl(friend.info.avatar_url) || undefined}}
                        style={styles.avatarImage}
                    />
                ) : (
                    <Text style={styles.avatarText}>
                        {(friend.info?.name || '?').charAt(0).toUpperCase()}
                    </Text>
                )}
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.nameText}>
                    {friend.info?.name || 'Unknown User'}
                </Text>
                <Text style={styles.subText}>{friend.email}</Text>
            </View>
            <View style={styles.flex}>
                <View style={styles.coinBadge}>
                    <Text style={styles.coinText}>🔥 {friend.info?.largest_streak || 0}</Text>
                </View>
                <View style={styles.coinBadge}>
                    <Text style={styles.coinText}>🪙 {friend.info?.coins || 0}</Text>
                </View>
            </View>

        </View>
    );
};