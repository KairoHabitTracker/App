import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, FlatList, Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Check, Copy, PersonStanding, Send, UserPlus, X} from '@tamagui/lucide-icons';
import {useFriends} from "@/src/hooks/useFriends";
import {FriendInvitation} from "@/src/types/friends/FriendInvitation";
import {friendsScreenStyles, sharedFonts} from "@/global";
import SharedButton from "@/src/components/SharedButton";
import {useAuth} from "@/src/contexts/AuthContext";
import * as Clipboard from 'expo-clipboard';

export default function FriendsScreen() {
    const {user} = useAuth();
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
    } = useFriends();

    const [showInviteModal, setShowInviteModal] = useState(false);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSendInvitation = () => {
        setShowInviteModal(false);
    };

    const copyMyId = async () => {
        if (user?.id) {
            await Clipboard.setStringAsync(user.id);
            Alert.alert("Copied!", "Your ID has been copied to clipboard. Send it to a friend!");
        } else {
            Alert.alert("Error", "Could not load your ID.");
        }
    };

    const getAvatarUrl = (url: string | null) => {
        if (!url) return null;

        let finalUrl = url;

        // React Native Image nie wyświetla SVG, więc prosimy API o PNG
        if (finalUrl.includes('api.dicebear.com') && finalUrl.includes('/svg')) {
            finalUrl = finalUrl.replace('/svg', '/png');
        }

        return finalUrl;
    };

    const formatUserId = (id: string) => {
        if (!id) return 'Unknown';
        if (id.length < 10) return id;
        return `${id.substring(0, 6)}...${id.substring(id.length - 4)}`;
    };

    const renderFriendItem = ({item: friend}: { item: any }) => {
        console.log("Avatar URL:", friend.info?.avatar_url);
        return (
            <View style={friendsScreenStyles.cardRow}>
                <View style={friendsScreenStyles.avatarContainer}>
                    {friend.info?.avatar_url ? (
                        <Image
                            source={{uri: getAvatarUrl(friend.info.avatar_url)}}
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
                <View style={friendsScreenStyles.coinBadge}>
                    <Text style={friendsScreenStyles.coinText}>🪙 {friend.info?.coins || 0}</Text>
                </View>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={friendsScreenStyles.centerContainer}>
                <ActivityIndicator size="large" color="#3B82F6"/>
            </View>
        );
    }

    return (
        <View style={friendsScreenStyles.screenContainer}>
            <View style={friendsScreenStyles.header}>
                <View>
                    <Text style={friendsScreenStyles.headerTitle}>Friends</Text>
                    <TouchableOpacity onPress={copyMyId} style={friendsScreenStyles.copyIdRow}>
                        <Text style={friendsScreenStyles.headerSubtitle}>
                            My ID: {formatUserId(user?.id || '')}
                        </Text>
                        <Copy size={14} color="#3B82F6" style={{marginLeft: 6}}/>
                    </TouchableOpacity>
                </View>
                <SharedButton
                    title="Invite"
                    onPress={() => setShowInviteModal(!showInviteModal)}
                    icon={<UserPlus size={18} color="white"/>}
                    style={{paddingVertical: 8, paddingHorizontal: 16}}
                />
            </View>

            {showInviteModal && (
                <View style={friendsScreenStyles.inviteContainer}>
                    <View style={friendsScreenStyles.inputWrapper}>
                        <PersonStanding size={20} color="#6B7280" style={{marginRight: 10}}/>
                        <TextInput
                            style={friendsScreenStyles.input}
                            placeholder="Enter User ID"
                            value={invite}
                            onChangeText={setInvite}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            onPress={() => sendInvitation(invite, handleSendInvitation)}
                            disabled={isSending}
                            style={friendsScreenStyles.sendIconBtn}
                        >
                            {isSending ? <ActivityIndicator size="small" color="#3B82F6"/> :
                                <Send size={20} color="#3B82F6"/>}
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <FlatList
                data={friends}
                keyExtractor={(item) => item.id}
                renderItem={renderFriendItem}
                contentContainerStyle={friendsScreenStyles.listContent}

                ListHeaderComponent={
                    <>
                        {invitations.length > 0 && (
                            <View style={friendsScreenStyles.sectionContainer}>
                                <Text style={friendsScreenStyles.sectionTitle}>PENDING INVITATIONS
                                    ({invitations.length})</Text>
                                <View style={friendsScreenStyles.cardGroup}>
                                    {invitations.map((invitation: FriendInvitation, index) => (
                                        <View key={invitation.id} style={[
                                            friendsScreenStyles.inviteRow,
                                            index !== invitations.length - 1 && friendsScreenStyles.divider
                                        ]}>
                                            <View style={friendsScreenStyles.inviteInfo}>
                                                <View
                                                    style={[friendsScreenStyles.avatarContainer, {backgroundColor: '#FEF3C7'}]}>
                                                    <Text
                                                        style={[friendsScreenStyles.avatarText, {color: '#D97706'}]}>?</Text>
                                                </View>
                                                <View style={{marginLeft: 12, flex: 1}}>
                                                    <Text style={friendsScreenStyles.nameText}>
                                                        {formatUserId(invitation.sender_id)}
                                                    </Text>
                                                    <Text style={friendsScreenStyles.subText}>
                                                        Wants to connect
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={friendsScreenStyles.actionButtons}>
                                                <TouchableOpacity
                                                    style={[friendsScreenStyles.iconBtn, {backgroundColor: '#DCFCE7'}]}
                                                    onPress={() => acceptInvitation(invitation.id)}
                                                >
                                                    <Check size={18} color="#16A34A"/>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[friendsScreenStyles.iconBtn, {
                                                        backgroundColor: '#FEE2E2',
                                                        marginLeft: 8
                                                    }]}
                                                    onPress={() => rejectInvitation(invitation.id)}
                                                >
                                                    <X size={18} color="#DC2626"/>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                        {friends.length > 0 && (
                            <Text style={[friendsScreenStyles.sectionTitle, {marginTop: 24}]}>ALL FRIENDS
                                ({friends.length})</Text>
                        )}
                    </>
                }

                ItemSeparatorComponent={() => <View style={friendsScreenStyles.dividerMargin}/>}

                ListEmptyComponent={
                    !isLoading && invitations.length === 0 ? (
                        <View style={friendsScreenStyles.emptyState}>
                            <Text style={{fontSize: 40, marginBottom: 10}}>👋</Text>
                            <Text style={sharedFonts.mediumSubtleText}>No friends yet. Add someone!</Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
}

