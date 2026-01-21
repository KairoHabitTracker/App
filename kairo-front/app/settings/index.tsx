import React, {useMemo, useState} from 'react';
import {Modal, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import {useRouter} from 'expo-router';
import {useAuth} from '@/src/contexts/AuthContext';
import {Activity, Bell, ChevronRight, HelpCircle, LogOut, Moon, Shield, Smartphone} from '@tamagui/lucide-icons';
import {sharedStyles} from '@/global';
import ProfileAvatar from '@/src/components/ProfileAvatar';
import {ThemeColors, useThemeMode} from '@/src/contexts/ThemeContext';

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

    const styles = useMemo(() => createStyles(colors), [colors]);

    const SectionHeader = ({title}: { title: string }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
    );

    const SettingsRow = ({
                             icon: Icon,
                             label,
                             value,
                             onPress,
                             isDestructive = false,
                             showChevron = true,
                             color = '#6B7280'
                         }: SettingsRowProps) => (
        <TouchableOpacity
            style={styles.row}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.rowLeft}>
                <View style={[styles.iconContainer, {backgroundColor: isDestructive ? 'rgba(239,68,68,0.15)' : colors.surface}]}> 
                    <Icon size={20} color={isDestructive ? '#EF4444' : color}/>
                </View>
                <Text style={[styles.rowLabel, isDestructive && styles.destructiveLabel]}>
                    {label}
                </Text>
            </View>
            <View style={styles.rowRight}>
                {value && <Text style={styles.rowValue}>{value}</Text>}
                {showChevron && <ChevronRight size={20} color={colors.subtleText as any}/>}
            </View>
        </TouchableOpacity>
    );

    const handleLogout = () => {
        logout();
        router.replace('/login');
    };

    const handleLogoutAll = async () => {
        setConfirmOpen(false);
        await logoutAll();
        router.replace('/login');
    };

    return (
        <View style={[sharedStyles.basicContainer, {backgroundColor: colors.background}]}> 
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.profileCard}>
                    <ProfileAvatar username={user?.username} avatarUrl={user?.avatarUrl} size={54}/>
                    <View style={{flex: 1}}>
                        <Text style={styles.profileName}>{user ? user.username : 'Guest'}</Text>
                        <Text style={styles.profileSubtext}>
                            {user ? `Current streak: ${user.streak} days · Coins: ${user.coins}` : 'Sign in to sync your progress'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => router.push('../profile/edit')}
                    >
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                </View>

                <SectionHeader title="INTEGRATIONS"/>
                <View style={styles.sectionContainer}>
                    <SettingsRow
                        icon={Activity}
                        label="Connections"
                        value="Work in progress"
                        onPress={() => router.push('../settings/connections')}
                        color="#10B981"
                    />
                    <View style={styles.banner}>
                        <Text style={styles.bannerTitle}>Coming soon</Text>
                        <Text style={styles.bannerText}>
                            Connecting to health apps is sadly still in development. We're working hard to bring this feature to you soon!
                        </Text>
                    </View>
                </View>

                <SectionHeader title="PREFERENCES"/>
                <View style={styles.sectionContainer}>
                    <SettingsRow
                        icon={Bell}
                        label="Notifications"
                        onPress={() => router.push('../settings/notifications')}
                        color="#F59E0B"
                    />
                    <View style={styles.divider}/>

                    <View style={styles.row}>
                        <View style={styles.rowLeft}>
                            <View style={[styles.iconContainer, {backgroundColor: colors.surface}]}> 
                                <Moon size={20} color={isDarkMode ? '#FCD34D' : '#6366F1'}/>
                            </View>
                            <Text style={styles.rowLabel}>Dark Mode</Text>
                        </View>
                        <Switch
                            value={isDarkMode}
                            onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
                            trackColor={{false: colors.border, true: colors.accent}}
                            thumbColor={isDarkMode ? '#FFFFFF' : '#F4F4F5'}
                        />
                    </View>
                </View>

                <SectionHeader title="SECURITY"/>
                <View style={styles.sectionContainer}>
                    <SettingsRow
                        icon={Shield}
                        label="Password & Security"
                        onPress={() => router.push('../settings/security')}
                        color="#3B82F6"
                    />
                </View>

                <SectionHeader title="SUPPORT"/>
                <View style={styles.sectionContainer}>
                    <SettingsRow
                        icon={HelpCircle}
                        label="About & Help"
                        value="v1.0.0"
                        onPress={() => router.push('../settings/about')}
                        color="#8B5CF6"
                    />
                </View>

                <SectionHeader title="ACCOUNT ACTIONS"/>
                <View style={styles.sectionContainer}>
                    <SettingsRow
                        icon={LogOut}
                        label="Log Out"
                        onPress={handleLogout}
                        isDestructive
                        showChevron={false}
                    />
                    <View style={styles.divider}/>
                    <SettingsRow
                        icon={Smartphone}
                        label="Log Out All Devices"
                        onPress={() => setConfirmOpen(true)}
                        isDestructive
                        showChevron={false}
                    />
                </View>

                <Text style={styles.footerText}>Kairo Habit © 2026</Text>
            </ScrollView>

            <Modal
                transparent
                visible={confirmOpen}
                animationType="fade"
                onRequestClose={() => setConfirmOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Log out from all devices?</Text>
                        <Text style={styles.modalDescription}>
                            You will be signed out from all other sessions. You'll need to log in again.
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonCancel]}
                                onPress={() => setConfirmOpen(false)}
                            >
                                <Text style={styles.modalButtonCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonConfirm]}
                                onPress={handleLogoutAll}
                            >
                                <Text style={styles.modalButtonConfirmText}>Log Out All</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: colors.background === '#0F172A' ? 0.4 : 0.05,
        shadowRadius: 8,
        elevation: 2,
        gap: 16,
    },
    profileName: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
    },
    profileSubtext: {
        fontSize: 13,
        color: colors.subtleText,
        marginTop: 4,
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
    sectionHeader: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.subtleText,
        marginBottom: 8,
        marginLeft: 4,
        letterSpacing: 0.5,
    },
    sectionContainer: {
        backgroundColor: colors.card,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: colors.background === '#0F172A' ? 0.3 : 0.05,
        shadowRadius: 6,
        elevation: 1,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginLeft: 56,
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
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.text,
    },
    destructiveLabel: {
        color: '#EF4444',
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    rowValue: {
        fontSize: 14,
        color: colors.subtleText,
    },
    footerText: {
        textAlign: 'center',
        color: colors.subtleText,
        fontSize: 12,
        marginTop: 8,
    },
    banner: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
        padding: 16,
        backgroundColor: colors.surface,
    },
    bannerTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    bannerText: {
        fontSize: 13,
        color: colors.subtleText,
        lineHeight: 18,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: colors.card,
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 8,
    },
    modalDescription: {
        fontSize: 14,
        color: colors.subtleText,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalButtonCancel: {
        backgroundColor: colors.surface,
    },
    modalButtonConfirm: {
        backgroundColor: '#EF4444',
    },
    modalButtonCancelText: {
        fontWeight: '600',
        color: colors.text,
    },
    modalButtonConfirmText: {
        fontWeight: '600',
        color: 'white',
    },
});