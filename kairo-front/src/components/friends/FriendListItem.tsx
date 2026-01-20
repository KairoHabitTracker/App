import React from 'react';
import {Image, Text, View} from 'react-native';
import {friendsScreenStyles} from "@/global";
import {Friend} from "@/src/types/friends/Friend";

interface FriendListItemProps {
    friend: Friend;
    getAvatarUrl: (url: string | null) => string | null;
}

export const FriendListItem = ({friend, getAvatarUrl}: FriendListItemProps) => {
    return (
        <View style={friendsScreenStyles.cardRow}>
            <View style={friendsScreenStyles.avatarContainer}>
                {friend.info?.avatar_url ? (
                    <Image
                        source={{uri: getAvatarUrl(friend.info.avatar_url) || undefined}}
                        style={friendsScreenStyles.avatarImage}
                    />
                ) : (
                    <Text style={friendsScreenStyles.avatarText}>
                        {(friend.info?.name || '?').charAt(0).toUpperCase()}
                    </Text>
                )}
            </View>
            <View style={friendsScreenStyles.infoContainer}>
                <Text style={friendsScreenStyles.nameText}>
                    {friend.info?.name || 'Unknown User'}
                </Text>
                <Text style={friendsScreenStyles.subText}>{friend.email}</Text>
            </View>
            <View style={friendsScreenStyles.flex}>
                <View style={[friendsScreenStyles.coinBadge]}>
                    <Text style={friendsScreenStyles.coinText}>🔥 {friend.info?.largest_streak || 0}</Text>
                </View>
                <View style={friendsScreenStyles.coinBadge}>
                    <Text style={friendsScreenStyles.coinText}>🪙 {friend.info?.coins || 0}</Text>
                </View>
            </View>

        </View>
    );
};