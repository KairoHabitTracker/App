import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Copy, UserPlus} from '@tamagui/lucide-icons';
import SharedButton from "@/src/components/SharedButton";
import {useFriendsStyles} from '@/src/styles/friendsStyles';
import {useThemeMode} from '@/src/contexts/ThemeContext';

interface FriendsHeaderProps {
    userId?: string;
    onCopyId: () => void;
    onInvitePress: () => void;
    formatId: (id: string) => string;
}

export const FriendsHeader = ({userId, onCopyId, onInvitePress, formatId}: FriendsHeaderProps) => {
    const styles = useFriendsStyles();
    const {colors} = useThemeMode();

    return (
        <View style={styles.header}>
            <View>
                <Text style={styles.headerTitle}>Friends</Text>
                <TouchableOpacity onPress={onCopyId} style={styles.copyIdRow}>
                    <Text style={styles.headerSubtitle}>
                        My ID: {formatId(userId || '')}
                    </Text>
                    <Copy size={14} color={colors.accent} style={{marginLeft: 6}}/>
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