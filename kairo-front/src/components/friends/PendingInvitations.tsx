import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Check, X} from '@tamagui/lucide-icons';
import {FriendInvitation} from '@/src/types/friends/FriendInvitation';
import {useFriendsStyles} from '@/src/styles/friendsStyles';
import {useThemeMode} from '@/src/contexts/ThemeContext';

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
  formatId,
}: PendingInvitationsProps) => {
  const styles = useFriendsStyles();
  const {colors} = useThemeMode();

  if (invitations.length === 0) return null;

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>PENDING INVITATIONS ({invitations.length})</Text>
      <View style={styles.cardGroup}>
        {invitations.map((invitation, index) => {
          const sender = invitation.sender;
          const senderInfo = sender.info;

          const displayName = senderInfo?.name || sender.email || formatId(sender.id);

          const avatarUrl = senderInfo?.avatar_url;

          const initial = (displayName || '?').charAt(0).toUpperCase();

          return (
            <View
              key={invitation.id}
              style={[styles.inviteRow, index !== invitations.length - 1 && styles.divider]}>
              <View style={styles.inviteInfo}>
                <View style={styles.avatarContainer}>
                  {avatarUrl ? (
                    <Image
                      source={{uri: getAvatarUrl(avatarUrl) || undefined}}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <Text style={styles.avatarText}>{initial}</Text>
                  )}
                </View>
                <View style={{marginLeft: 12, flex: 1}}>
                  <Text style={styles.nameText} numberOfLines={1}>
                    {displayName}
                  </Text>
                  <Text style={styles.subText}>Wants to connect</Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.iconBtn, {backgroundColor: colors.successBackground}]}
                  onPress={() => onAccept(invitation.id)}>
                  <Check size={18} color={colors.success} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.iconBtn,
                    {backgroundColor: colors.dangerBackground, marginLeft: 8},
                  ]}
                  onPress={() => onReject(invitation.id)}>
                  <X size={18} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};
