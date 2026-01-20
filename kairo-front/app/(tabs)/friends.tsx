import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, FlatList, Text, View} from 'react-native';
import {useAuth} from "@/src/contexts/AuthContext";
import {useFriends} from "@/src/hooks/useFriends";
import {friendsScreenStyles, sharedFonts} from "@/global";
import * as Clipboard from 'expo-clipboard';
import SharedButton from "@/src/components/SharedButton";
import {UserPlus} from '@tamagui/lucide-icons';
import {FriendsHeader} from "@/src/components/friends/FriendsHeader";
import {InviteModal} from "@/src/components/friends/InviteModal";
import {PendingInvitations} from "@/src/components/friends/PendingInvitations";
import {FriendListItem} from "@/src/components/friends/FriendListItem";

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

    const copyMyId = async () => {
        if (user?.id) {
            await Clipboard.setStringAsync(user.id);
            Alert.alert("Copied!", "ID copied to clipboard.");
        } else {
            Alert.alert("Error", "Could not load ID.");
        }
    };

    const getAvatarUrl = (url: string | null) => {
        if (!url) return null;
        let finalUrl = url;
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

    const handleSendInvitation = () => {
        sendInvitation(invite, () => setShowInviteModal(false));
    };

    if (isLoading) {
        return (
            <View style={friendsScreenStyles.centerContainer}>
                <ActivityIndicator size="large" color="#3B82F6"/>
            </View>
        );
    }

    return (
        <View style={friendsScreenStyles.screenContainer}>
            <FriendsHeader
                userId={user?.id}
                onCopyId={copyMyId}
                onInvitePress={() => setShowInviteModal(!showInviteModal)}
                formatId={formatUserId}
            />

            <InviteModal
                visible={showInviteModal}
                inviteCode={invite}
                setInviteCode={setInvite}
                onSend={handleSendInvitation}
                isSending={isSending}
            />

            <FlatList
                data={friends}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <FriendListItem friend={item} getAvatarUrl={getAvatarUrl}/>
                )}
                contentContainerStyle={friendsScreenStyles.listContent}

                ListHeaderComponent={
                    <>
                        <PendingInvitations
                            invitations={invitations}
                            onAccept={acceptInvitation}
                            onReject={rejectInvitation}
                            getAvatarUrl={getAvatarUrl}
                            formatId={formatUserId}
                        />

                        {friends.length > 0 && (
                            <Text style={[friendsScreenStyles.sectionTitle, {marginTop: 24}]}>
                                ALL FRIENDS ({friends.length})
                            </Text>
                        )}
                    </>
                }

                ItemSeparatorComponent={() => <View style={friendsScreenStyles.dividerMargin}/>}

                ListEmptyComponent={
                    !isLoading && invitations.length === 0 ? (
                        <View style={friendsScreenStyles.emptyState}>
                            <Text style={{fontSize: 40, marginBottom: 10}}>👋</Text>
                            <Text style={sharedFonts.mediumSubtleText}>No friends yet. Add someone!</Text>
                            <SharedButton
                                title="Invite Friends"
                                onPress={() => setShowInviteModal(true)}
                                icon={<UserPlus size={20} color="white"/>}
                                style={{marginTop: 20, paddingHorizontal: 24}}
                            />
                        </View>
                    ) : null
                }
            />
        </View>
    );
}