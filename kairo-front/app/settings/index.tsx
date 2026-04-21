import React, {useMemo, useState} from 'react';
import {Modal, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import {useRouter} from 'expo-router';
import {useAuth} from '@/src/contexts/AuthContext';
import {Activity, Bell, ChevronRight, HelpCircle, LogOut, Moon, Shield, Smartphone,} from '@tamagui/lucide-icons';
import ProfileAvatar from '@/src/components/ProfileAvatar';
import {ThemeColors, useThemeMode} from '@/src/contexts/ThemeContext';
import {useScreenStyles} from '@/src/styles/screenStyles';

type SettingsRowProps = {
  icon: React.ElementType;
  label: string;
  value?: string;
  onPress?: () => void;
  isDestructive?: boolean;
  showChevron?: boolean;
  color?: string;
};

export default function SettingsScreen() {
  const {logout, logoutAll, user} = useAuth();
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const {colors, isDarkMode, setTheme} = useThemeMode();
  const s = useScreenStyles();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const SectionHeader = ({title}: { title: string }) => <Text style={s.sectionTitle}>{title}</Text>;

  const SettingsRow = ({
                         icon: Icon,
                         label,
                         value,
                         onPress,
                         isDestructive = false,
                         showChevron = true,
                         color = '#6B7280',
                       }: SettingsRowProps) => (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.rowLeft}>
        <View
          style={[
            s.iconBadge,
            {backgroundColor: isDestructive ? 'rgba(239,68,68,0.15)' : colors.surface},
          ]}>
          <Icon size={20} color={isDestructive ? '#EF4444' : color}/>
        </View>
        <Text style={[s.itemTitle, isDestructive && {color: '#EF4444'}]}>{label}</Text>
      </View>
      <View style={styles.rowRight}>
        {value && <Text style={s.itemSubtext}>{value}</Text>}
        {showChevron && <ChevronRight size={20} color={colors.subtleText as any}/>}
      </View>
    </TouchableOpacity>
  );

  const handleLogout = () => {
    logout();
  };

  const handleLogoutAll = async () => {
    setConfirmOpen(false);
    await logoutAll();
  };

  return (
    <View style={[s.screen, {backgroundColor: colors.background}]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View
          style={[s.card, {flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24}]}>
          <ProfileAvatar username={user?.username} avatarUrl={user?.avatarUrl} size={54}/>
          <View style={{flex: 1}}>
            <Text style={s.itemTitle}>{user ? user.username : 'Guest'}</Text>
            <Text style={s.itemSubtext}>
              {user
                ? `Current streak: ${user.streak} days · Coins: ${user.coins}`
                : 'Sign in to sync your progress'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('../profile/edit')}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <SectionHeader title="INTEGRATIONS"/>
        <View style={s.cardGroup}>
          <SettingsRow
            icon={Activity}
            label="Connections"
            value="Work in progress"
            onPress={() => router.push('../settings/connections')}
            color="#10B981"
          />
          <View style={styles.banner}>
            <Text style={[s.itemTitle, {fontSize: 13}]}>Coming soon</Text>
            <Text style={[s.itemSubtext, {lineHeight: 18, marginTop: 4}]}>
              Connecting to health apps is sadly still in development. We&apos;re working hard to
              bring this feature to you soon!
            </Text>
          </View>
        </View>

        <SectionHeader title="PREFERENCES"/>
        <View style={s.cardGroup}>
          <SettingsRow
            icon={Bell}
            label="Notifications"
            onPress={() => router.push('../settings/notifications')}
            color="#F59E0B"
          />
          <View style={s.dividerIndented}/>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[s.iconBadge, {backgroundColor: colors.surface}]}>
                <Moon size={20} color={isDarkMode ? '#FCD34D' : '#6366F1'}/>
              </View>
              <Text style={s.itemTitle}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={value => setTheme(value ? 'dark' : 'light')}
              trackColor={{false: colors.subtleText, true: colors.accent}}
              thumbColor={isDarkMode ? '#FFFFFF' : colors.surface}
            />
          </View>
        </View>

        <SectionHeader title="SECURITY"/>
        <View style={s.cardGroup}>
          <SettingsRow
            icon={Shield}
            label="Password & Security"
            onPress={() => router.push('../settings/security')}
            color="#3B82F6"
          />
        </View>

        <SectionHeader title="SUPPORT"/>
        <View style={s.cardGroup}>
          <SettingsRow
            icon={HelpCircle}
            label="About & Help"
            value="v1.0.0"
            onPress={() => router.push('../settings/about')}
            color="#8B5CF6"
          />
        </View>

        <SectionHeader title="ACCOUNT ACTIONS"/>
        <View style={s.cardGroup}>
          <SettingsRow
            icon={LogOut}
            label="Log Out"
            onPress={handleLogout}
            isDestructive
            showChevron={false}
          />
          <View style={s.dividerIndented}/>
          <SettingsRow
            icon={Smartphone}
            label="Log Out All Devices"
            onPress={() => setConfirmOpen(true)}
            isDestructive
            showChevron={false}
          />
        </View>

        <Text style={[s.itemSubtext, {textAlign: 'center', marginTop: 8}]}>Kairo Habit © 2026</Text>
      </ScrollView>

      <Modal
        transparent
        visible={confirmOpen}
        animationType="fade"
        onRequestClose={() => setConfirmOpen(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContainer}>
            <Text style={s.modalTitle}>Log out from all devices?</Text>
            <Text style={s.modalDescription}>
              You will be signed out from all other sessions. You&apos;ll need to log in again.
            </Text>
            <View style={s.modalButtonsRow}>
              <TouchableOpacity
                style={[s.modalButton, s.modalButtonCancel]}
                onPress={() => setConfirmOpen(false)}>
                <Text style={s.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.modalButton, s.modalButtonConfirm]}
                onPress={handleLogoutAll}>
                <Text style={s.modalButtonConfirmText}>Log Out All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 40,
    },
    editButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: colors.surface,
      borderRadius: 20,
    },
    editButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.text,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: colors.card,
    },
    rowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    rowRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    banner: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      padding: 16,
      backgroundColor: colors.surface,
    },
  });
