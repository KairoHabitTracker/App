import {useCallback, useState} from 'react';
import {Alert} from "react-native";
import {apiFetch} from '@/src/lib/api';
import {Friend} from "@/src/types/friends/Friend";
import {FriendInvitation} from "@/src/types/friends/FriendInvitation";

type FriendsResponse = { data: Friend[] };
type InvitationsResponse = { data: FriendInvitation[] };

export const useFriends = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [invitations, setInvitations] = useState<FriendInvitation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [invite, setInvite] = useState('');


    const loadFriends = useCallback(async () => {
        try {
            const json = await apiFetch<FriendsResponse>('/api/friends');
            setFriends(json.data || []);
        } catch (error) {
            console.error('Error loading friends:', error);
        }
    }, []);

    const loadInvitations = useCallback(async () => {
        try {
            const json = await apiFetch<InvitationsResponse>('/api/friend-requests/received');
            const pending = json.data
                ? json.data.filter((inv) => inv.status === 'pending')
                : [];
            setInvitations(pending);
        } catch (error) {
            console.error('Error loading invitations:', error);
        }
    }, []);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        await Promise.all([loadFriends(), loadInvitations()]);
        setIsLoading(false);
    }, [loadFriends, loadInvitations]);

    const sendInvitation = useCallback(async (friendIdInput: string, onComplete: () => void) => {
        if (!friendIdInput.trim()) {
            Alert.alert('Błąd', 'Wpisz ID znajomego');
            return;
        }

        setIsSending(true);
        try {
            await apiFetch('/api/friend-requests', {
                method: 'POST',
                body: JSON.stringify({friend_id: friendIdInput.trim()}),
            });

            Alert.alert('Sukces', 'Zaproszenie wysłane!');
            setInvite('');
            onComplete();
        } catch (error: any) {
            console.error('Error sending invitation:', error);
            Alert.alert('Błąd', error.message || 'Nie udało się wysłać zaproszenia');
        } finally {
            setIsSending(false);
        }
    }, []);

    const acceptInvitation = useCallback(async (invitationId: number) => {
        try {
            await apiFetch(`/api/friend-requests/accept/${invitationId}`, {
                method: 'POST',
            });
            await loadData();
            Alert.alert("Sukces", "Masz nowego znajomego!");
        } catch (error) {
            console.error('Error accepting invitation:', error);
            Alert.alert("Błąd", "Nie udało się zaakceptować zaproszenia");
        }
    }, [loadData]);

    const rejectInvitation = useCallback(async (invitationId: number) => {
        try {
            await apiFetch(`/api/friend-requests/reject/${invitationId}`, {
                method: 'POST',
            });
            setInvitations(prev => prev.filter(i => i.id !== invitationId));
        } catch (error) {
            console.error('Error rejecting invitation:', error);
        }
    }, []);

    return {
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
    };
};