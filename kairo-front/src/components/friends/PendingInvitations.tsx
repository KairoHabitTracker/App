import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Check, X} from '@tamagui/lucide-icons';
import {FriendInvitation} from "@/src/types/friends/FriendInvitation";
import {friendsScreenStyles} from "@/global";

interface PendingInvitationsProps {
    invitations: FriendInvitation[];
    onAccept: (id: number) => void;
    onReject: (id: number) => void;
    getAvatarUrl: (url: string | null) => string | null;
    formatId: (id: string) => string;
}

export const PendingInvitations = ({
                                       invitations,
                                       onAccept,
                                       onReject,
                                       getAvatarUrl,
                                       formatId
                                   }: PendingInvitationsProps) => {
    if (invitations.length === 0) return null;

    return (
        <View style={friendsScreenStyles.sectionContainer}>
            <Text style={friendsScreenStyles.sectionTitle}>
                PENDING INVITATIONS ({invitations.length})
            </Text>
            <View style={friendsScreenStyles.cardGroup}>
                {invitations.map((invitation, index) => {

                    const sender = invitation.sender;
                    const senderInfo = sender.info;

                    const displayName = senderInfo?.name || sender.email || formatId(sender.id);

                    const avatarUrl = senderInfo?.avatar_url;

                    const initial = (displayName || '?').charAt(0).toUpperCase();

                    return (
                        <View key={invitation.id} style={[
                            friendsScreenStyles.inviteRow,
                            index !== invitations.length - 1 && friendsScreenStyles.divider
                        ]}>
                            <View style={friendsScreenStyles.inviteInfo}>
                                <View style={[friendsScreenStyles.avatarContainer, {backgroundColor: '#FEF3C7'}]}>
                                    {avatarUrl ? (
                                        <Image
                                            source={{uri: getAvatarUrl(avatarUrl) || undefined}}
                                            style={friendsScreenStyles.avatarImage}
                                        />
                                    ) : (
                                        <Text style={[friendsScreenStyles.avatarText, {color: '#D97706'}]}>
                                            {initial}
                                        </Text>
                                    )}
                                </View>
                                <View style={{marginLeft: 12, flex: 1}}>
                                    <Text style={friendsScreenStyles.nameText} numberOfLines={1}>
                                        {displayName}
                                    </Text>
                                    <Text style={friendsScreenStyles.subText}>
                                        Wants to connect
                                    </Text>
                                </View>
                            </View>

                            <View style={friendsScreenStyles.actionButtons}>
                                <TouchableOpacity
                                    style={[friendsScreenStyles.iconBtn, {backgroundColor: '#DCFCE7'}]}
                                    onPress={() => onAccept(invitation.id)}
                                >
                                    <Check size={18} color="#16A34A"/>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[friendsScreenStyles.iconBtn, {backgroundColor: '#FEE2E2', marginLeft: 8}]}
                                    onPress={() => onReject(invitation.id)}
                                >
                                    <X size={18} color="#DC2626"/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};