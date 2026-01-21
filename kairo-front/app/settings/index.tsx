import React, {useState} from 'react';
import {Modal, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import {useRouter} from 'expo-router';
import {useAuth} from '@/src/contexts/AuthContext';
import {Activity, Bell, ChevronRight, HelpCircle, LogOut, Moon, Shield, Smartphone} from '@tamagui/lucide-icons';
import {sharedStyles} from '@/global';

const SectionHeader = ({title}: { title: string }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
);

interface SettingsRowProps {
    icon: React.ElementType;
    label: string;
    value?: string;
    onPress?: () => void;
    isDestructive?: boolean;
    showChevron?: boolean;
    color?: string;
}

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
            <View style={[styles.iconContainer, {backgroundColor: isDestructive ? '#FEF2F2' : '#F3F4F6'}]}>
                <Icon size={20} color={isDestructive ? '#EF4444' : color}/>
            </View>
            <Text style={[styles.rowLabel, isDestructive && styles.destructiveLabel]}>
                {label}
            </Text>
        </View>
        <View style={styles.rowRight}>
            {value && <Text style={styles.rowValue}>{value}</Text>}
            {showChevron && <ChevronRight size={20} color="#9CA3AF"/>}
        </View>
    </TouchableOpacity>
);


export default function SettingsScreen() {
    const { logout, logoutAll, user } = useAuth();
    const router = useRouter();
    const [confirmOpen, setConfirmOpen] = useState(false);

    const [isDarkMode, setIsDarkMode] = useState(false);

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
        <View style={sharedStyles.basicContainer}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.profileCard}>
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarInitial}>
                            {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
                        </Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={styles.profileName}>{user ? user.username : 'Guest'}</Text>
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
                        value="Google Fit"
                        onPress={() => router.push('../settings/connections')}
                        color="#10B981"
                    />
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
                            <View style={[styles.iconContainer, {backgroundColor: '#F3F4F6'}]}>
                                <Moon size={20} color="#6366F1"/>
                            </View>
                            <Text style={styles.rowLabel}>Dark Mode</Text>
                        </View>
                        <Switch
                            value={isDarkMode}
                            onValueChange={setIsDarkMode}
                            trackColor={{false: '#E5E7EB', true: '#93C5FD'}}
                            thumbColor={isDarkMode ? '#3B82F6' : '#F4F4F5'}
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
                        value="v0.1.0"
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

                <Text style={styles.footerText}>OneHabit Inc. © 2026</Text>
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
                            You will be signed out from all other sessions. You&#39;ll need to log in again.
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

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#fff',
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },

    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarInitial: {
        fontSize: 20,
        fontWeight: '700',
        color: '#3B82F6',
    },
    profileName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    profileEmail: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    editButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
    },
    editButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4B5563',
    },

    sectionHeader: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9CA3AF',
        marginBottom: 8,
        marginLeft: 4,
        letterSpacing: 0.5,
    },
    sectionContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginLeft: 56,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: 'white',
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
        color: '#1F2937',
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
        color: '#9CA3AF',
    },
    footerText: {
        textAlign: 'center',
        color: '#D1D5DB',
        fontSize: 12,
        marginTop: 8,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    modalDescription: {
        fontSize: 14,
        color: '#6B7280',
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
        backgroundColor: '#F3F4F6',
    },
    modalButtonConfirm: {
        backgroundColor: '#EF4444',
    },
    modalButtonCancelText: {
        fontWeight: '600',
        color: '#374151',
    },
    modalButtonConfirmText: {
        fontWeight: '600',
        color: 'white',
    },
});