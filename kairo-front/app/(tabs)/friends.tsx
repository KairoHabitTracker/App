import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {Check, Copy, PersonStanding, Send, UserPlus, X} from '@tamagui/lucide-icons';
import {useFriends} from "@/src/hooks/useFriends";
import {FriendInvitation} from "@/src/types/friends/FriendInvitation";
import {sharedFonts} from "@/global";
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

    const formatUserId = (id: string) => {
        if (!id) return 'Unknown';
        if (id.length < 10) return id;
        return `${id.substring(0, 6)}...${id.substring(id.length - 4)}`;
    };

    const renderFriendItem = ({item: friend}: { item: any }) => (
        <View style={localStyles.cardRow}>
            <View style={localStyles.avatarContainer}>
                {friend.info?.avatar_url ? (
                    <Image source={{uri: friend.info.avatar_url}} style={localStyles.avatarImage}/>
                ) : (
                    <Text style={localStyles.avatarText}>
                        {(friend.info?.name || '?').charAt(0).toUpperCase()}
                    </Text>
                )}
            </View>
            <View style={localStyles.infoContainer}>
                <Text style={localStyles.nameText}>
                    {friend.info?.name || 'Unknown User'}
                </Text>
                <Text style={localStyles.subText}>{friend.email}</Text>
            </View>
            <View style={localStyles.coinBadge}>
                <Text style={localStyles.coinText}>🪙 {friend.info?.coins || 0}</Text>
            </View>
        </View>
    );

    if (isLoading) {
        return (
            <View style={localStyles.centerContainer}>
                <ActivityIndicator size="large" color="#3B82F6"/>
            </View>
        );
    }

    return (
        <View style={localStyles.screenContainer}>
            <View style={localStyles.header}>
                <View>
                    <Text style={localStyles.headerTitle}>Friends</Text>
                    <TouchableOpacity onPress={copyMyId} style={localStyles.copyIdRow}>
                        <Text style={localStyles.headerSubtitle}>
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
                <View style={localStyles.inviteContainer}>
                    <View style={localStyles.inputWrapper}>
                        <PersonStanding size={20} color="#6B7280" style={{marginRight: 10}}/>
                        <TextInput
                            style={localStyles.input}
                            placeholder="Enter User ID"
                            value={invite}
                            onChangeText={setInvite}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            onPress={() => sendInvitation(invite, handleSendInvitation)}
                            disabled={isSending}
                            style={localStyles.sendIconBtn}
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
                contentContainerStyle={localStyles.listContent}

                ListHeaderComponent={
                    <>
                        {invitations.length > 0 && (
                            <View style={localStyles.sectionContainer}>
                                <Text style={localStyles.sectionTitle}>PENDING INVITATIONS ({invitations.length})</Text>
                                <View style={localStyles.cardGroup}>
                                    {invitations.map((invitation: FriendInvitation, index) => (
                                        <View key={invitation.id} style={[
                                            localStyles.inviteRow,
                                            index !== invitations.length - 1 && localStyles.divider
                                        ]}>
                                            <View style={localStyles.inviteInfo}>
                                                <View
                                                    style={[localStyles.avatarContainer, {backgroundColor: '#FEF3C7'}]}>
                                                    <Text style={[localStyles.avatarText, {color: '#D97706'}]}>?</Text>
                                                </View>
                                                <View style={{marginLeft: 12, flex: 1}}>
                                                    <Text style={localStyles.nameText}>
                                                        {formatUserId(invitation.sender_id)}
                                                    </Text>
                                                    <Text style={localStyles.subText}>
                                                        Wants to connect
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={localStyles.actionButtons}>
                                                <TouchableOpacity
                                                    style={[localStyles.iconBtn, {backgroundColor: '#DCFCE7'}]}
                                                    onPress={() => acceptInvitation(invitation.id)}
                                                >
                                                    <Check size={18} color="#16A34A"/>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[localStyles.iconBtn, {
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
                            <Text style={[localStyles.sectionTitle, {marginTop: 24}]}>ALL FRIENDS
                                ({friends.length})</Text>
                        )}
                    </>
                }

                ItemSeparatorComponent={() => <View style={localStyles.dividerMargin}/>}

                ListEmptyComponent={
                    !isLoading && invitations.length === 0 ? (
                        <View style={localStyles.emptyState}>
                            <Text style={{fontSize: 40, marginBottom: 10}}>👋</Text>
                            <Text style={sharedFonts.mediumSubtleText}>No friends yet. Add someone!</Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
}

const localStyles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    copyIdRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        paddingVertical: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 8,
        marginLeft: 4
    },

    cardGroup: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 0,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        overflow: 'hidden'
    },
    sectionContainer: {
        marginBottom: 8
    },

    cardRow: {
        backgroundColor: 'white',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },

    inviteRow: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6'
    },
    dividerMargin: {
        height: 8
    },
    inviteInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    actionButtons: {
        flexDirection: 'row',
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },

    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    avatarImage: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#3B82F6'
    },
    infoContainer: {
        flex: 1
    },
    nameText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827'
    },
    subText: {
        fontSize: 13,
        color: '#6B7280'
    },
    coinBadge: {
        backgroundColor: '#FFF7ED',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFEDD5'
    },
    coinText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#B45309'
    },

    inviteContainer: {
        padding: 16,
        backgroundColor: '#F9FAFB'
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB'
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
    },
    sendIconBtn: {
        padding: 8
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 40
    }
});