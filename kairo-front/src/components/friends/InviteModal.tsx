import React from 'react';
import {ActivityIndicator, TextInput, TouchableOpacity, View} from 'react-native';
import {PersonStanding, Send} from '@tamagui/lucide-icons';
import {useFriendsStyles} from '@/src/styles/friendsStyles';
import {useThemeMode} from '@/src/contexts/ThemeContext';

interface InviteModalProps {
    visible: boolean;
    inviteCode: string;
    setInviteCode: (text: string) => void;
    onSend: () => void;
    isSending: boolean;
}

export const InviteModal = ({visible, inviteCode, setInviteCode, onSend, isSending}: InviteModalProps) => {
    if (!visible) return null;

    const styles = useFriendsStyles();
    const {colors, colorScheme} = useThemeMode();

    return (
        <View style={styles.inviteContainer}>
            <View style={styles.inputWrapper}>
                <PersonStanding size={20} color={colors.subtleText} style={{marginRight: 10}}/>
                <TextInput
                    style={styles.input}
                    placeholder="Enter User ID"
                    placeholderTextColor={colors.subtleText}
                    value={inviteCode}
                    onChangeText={setInviteCode}
                    autoCapitalize="none"
                    keyboardAppearance={colorScheme}
                />
                <TouchableOpacity
                    onPress={onSend}
                    disabled={isSending}
                    style={styles.sendIconBtn}
                >
                    {isSending ? (
                        <ActivityIndicator size="small" color={colors.accent}/>
                    ) : (
                        <Send size={20} color={colors.accent}/>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};