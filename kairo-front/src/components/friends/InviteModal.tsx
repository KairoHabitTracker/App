import React from 'react';
import {ActivityIndicator, TextInput, TouchableOpacity, View} from 'react-native';
import {PersonStanding, Send} from '@tamagui/lucide-icons';
import {friendsScreenStyles} from "@/global";

interface InviteModalProps {
    visible: boolean;
    inviteCode: string;
    setInviteCode: (text: string) => void;
    onSend: () => void;
    isSending: boolean;
}

export const InviteModal = ({visible, inviteCode, setInviteCode, onSend, isSending}: InviteModalProps) => {
    if (!visible) return null;

    return (
        <View style={friendsScreenStyles.inviteContainer}>
            <View style={friendsScreenStyles.inputWrapper}>
                <PersonStanding size={20} color="#6B7280" style={{marginRight: 10}}/>
                <TextInput
                    style={friendsScreenStyles.input}
                    placeholder="Enter User ID"
                    value={inviteCode}
                    onChangeText={setInviteCode}
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    onPress={onSend}
                    disabled={isSending}
                    style={friendsScreenStyles.sendIconBtn}
                >
                    {isSending ? (
                        <ActivityIndicator size="small" color="#3B82F6"/>
                    ) : (
                        <Send size={20} color="#3B82F6"/>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};