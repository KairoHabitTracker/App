import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Copy, UserPlus} from '@tamagui/lucide-icons';
import SharedButton from "@/src/components/SharedButton";
import {friendsScreenStyles} from "@/global";

interface FriendsHeaderProps {
    userId?: string;
    onCopyId: () => void;
    onInvitePress: () => void;
    formatId: (id: string) => string;
}

export const FriendsHeader = ({userId, onCopyId, onInvitePress, formatId}: FriendsHeaderProps) => {
    return (
        <View style={friendsScreenStyles.header}>
            <View>
                <Text style={friendsScreenStyles.headerTitle}>Friends</Text>
                <TouchableOpacity onPress={onCopyId} style={friendsScreenStyles.copyIdRow}>
                    <Text style={friendsScreenStyles.headerSubtitle}>
                        My ID: {formatId(userId || '')}
                    </Text>
                    <Copy size={14} color="#3B82F6" style={{marginLeft: 6}}/>
                </TouchableOpacity>
            </View>
            <SharedButton
                title="Invite"
                onPress={onInvitePress}
                icon={<UserPlus size={18} color="white"/>}
                style={{paddingVertical: 8, paddingHorizontal: 16}}
            />
        </View>
    );
};