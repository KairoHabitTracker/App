import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useAuth} from '@/src/contexts/AuthContext';
import {PersonStanding, Send, UserPlus, Users} from '@tamagui/lucide-icons';
import {useFriends} from "@/src/hooks/useFriends";
import {FriendInvitation} from "@/src/types/friends/FriendInvitation";
import {friendStyles} from "@/global";


export default function FriendsScreen() {
    const {token} = useAuth();

    const {
        friends,
        invitations,
        isLoading,
        isSending,
        invite,
        setInvite,
        loadData,
        sendInvitation,
        acceptInvitation,
        rejectInvitation,
    } = useFriends(token);


    const [showInviteModal, setShowInviteModal] = useState(false);


    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSendInvitation = () => {
        sendInvitation(invite, () => {
            setInvite('');
            setShowInviteModal(false);
        });
    };


    if (isLoading) {
        return (
            <View style={friendStyles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6"/>
            </View>
        );
    }

    return (
        <View style={friendStyles.container}>
            <View style={friendStyles.header}>
                <View>
                    <Text style={friendStyles.headerTitle}>Friends</Text>
                    <Text style={friendStyles.headerSubtitle}>
                        {friends.length} {friends.length === 1 ? 'friend' : 'friends'}
                    </Text>
                </View>
                <TouchableOpacity
                    style={friendStyles.inviteButton}
                    onPress={() => setShowInviteModal(!showInviteModal)}
                >
                    <UserPlus size={20} color="white"/>
                    <Text style={friendStyles.inviteButtonText}>Invite</Text>
                </TouchableOpacity>
            </View>

            {showInviteModal && (
                <View style={friendStyles.inviteSection}>
                    <Text style={friendStyles.inviteTitle}>Invite a Friend</Text>
                    <View style={friendStyles.inviteInputContainer}>
                        <PersonStanding size={20} color="#6B7280" style={friendStyles.inviteIcon}/>
                        <TextInput
                            style={friendStyles.inviteInput}
                            placeholder="Code from a friend"
                            value={invite}
                            onChangeText={setInvite}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            style={friendStyles.sendButton}
                            onPress={sendInvitation(invite, handleSendInvitation)}
                            disabled={isSending}
                        >
                            {isSending ? (
                                <ActivityIndicator size="small" color="#3B82F6"/>
                            ) : (
                                <Send size={20} color="#3B82F6"/>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <ScrollView
                contentContainerStyle={friendStyles.scrollContent}
            >
                {invitations.length > 0 && (
                    <View style={friendStyles.section}>
                        <View style={friendStyles.sectionHeader}>
                            <PersonStanding size={18} color="#F59E0B"/>
                            <Text style={friendStyles.sectionTitle}>
                                Pending Invitations ({invitations.length})
                            </Text>
                        </View>
                        {invitations.map((invitation: FriendInvitation) => (
                            <View key={invitation.id} style={friendStyles.invitationCard}>
                                <View style={friendStyles.invitationInfo}>
                                    <View style={friendStyles.avatar}>
                                        <Text style={friendStyles.avatarText}>
                                            {invitation.sender_id || '?'}
                                        </Text>
                                    </View>
                                    <View style={friendStyles.invitationDetails}>
                                        <Text style={friendStyles.invitationName}>
                                            {invitation.sender_id || 'Unknown User'}
                                        </Text>
                                        <Text style={friendStyles.invitationDate}>
                                            {new Date(invitation.created_at).toLocaleDateString()}
                                        </Text>
                                    </View>
                                </View>
                                <View style={friendStyles.invitationActions}>
                                    <TouchableOpacity
                                        style={[friendStyles.actionButton, friendStyles.acceptButton]}
                                        onPress={() => acceptInvitation(invitation.id)}
                                    >
                                        <Text style={friendStyles.acceptButtonText}>Accept</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[friendStyles.actionButton, friendStyles.rejectButton]}
                                        onPress={() => rejectInvitation(invitation.id)}
                                    >
                                        <Text style={friendStyles.rejectButtonText}>Decline</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {friends.length > 0 ? (
                    <View style={friendStyles.section}>
                        <View style={friendStyles.sectionHeader}>
                            <Users size={18} color="#3B82F6"/>
                            <Text style={friendStyles.sectionTitle}>
                                All Friends ({friends.length})
                            </Text>
                        </View>
                        {friends.map((friend) => (
                            <View key={friend.id} style={friendStyles.friendCard}>
                                <View style={friendStyles.friendAvatar}>
                                    {friend.info?.avatar_url ? (
                                        <Image
                                            source={{uri: friend.info.avatar_url}}
                                            style={friendStyles.avatarImage}
                                        />
                                    ) : (
                                        <Text style={friendStyles.avatarText}>
                                            {friend.info?.name?.[0]?.toUpperCase() || '?'}
                                        </Text>
                                    )}
                                </View>
                                <View style={friendStyles.friendInfo}>
                                    <Text style={friendStyles.friendName}>{friend.info?.name || 'Unknown'}</Text>
                                    <Text style={friendStyles.friendEmail}>{friend.email}</Text>
                                </View>
                                <View style={friendStyles.coinsBadge}>
                                    <Text style={friendStyles.coinsText}>🪙 {friend.info?.coins || 0}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={friendStyles.emptyState}>
                        <Text style={friendStyles.emptyEmoji}>😢</Text>
                        <Text style={friendStyles.emptyTitle}>No friends yet</Text>
                        <Text style={friendStyles.emptyText}>
                            Invite your friends to start tracking habits together!
                        </Text>
                        <TouchableOpacity
                            style={friendStyles.emptyButton}
                            onPress={() => setShowInviteModal(true)}
                        >
                            <UserPlus size={20} color="white"/>
                            <Text style={friendStyles.emptyButtonText}>Invite Friends</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
