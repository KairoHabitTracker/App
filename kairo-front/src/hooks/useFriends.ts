import {useCallback, useState} from 'react';
import {Friend} from "@/src/types/friends/Friend";
import {FriendInvitation} from "@/src/types/friends/FriendInvitation";
import {API_BASE} from '@/src/lib/api';
import {Alert} from "react-native";


export const useFriends = (token: string | null) => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [invitations, setInvitations] = useState<FriendInvitation[] | any>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [isSending, setIsSending] = useState(false);
    const [invite, setInvite] = useState('');


    const loadFriends = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE}/api/friends`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const json = await response.json();
            setFriends(json.data ? json.data : []);
        } catch (error) {
            console.error('Error loading friends:', error);
        }
    }, [token]);

    const loadInvitations = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE}/api/friend-requests/received`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const json = await response.json();
            const pending = json.data
                ? json.data.filter((inv: any) => inv.status === pending)
                : [];
            setInvitations(pending);
        } catch (error) {
            console.error('Error loading invitations:', error);
        }
    }, [token]);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        await Promise.all([loadFriends(), loadInvitations()]);
        setIsLoading(false);
    }, [loadFriends, loadInvitations]);


    const sendInvitation = useCallback(async (invite: string, onComplete: () => void) => {
        if (!invite) {
            Alert.alert('Error', 'Please enter friend code');
            return;
        }

        setIsSending(true);
        try {
            const response = await fetch(`${API_BASE}/api/friend-requests`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id: invite}),
            });

            if (response.ok) {
                Alert.alert('Success', 'Invitation sent!');
                onComplete();
            } else {
                Alert.alert('Error', 'Failed to send invitation');
            }
        } catch (error) {
            console.error('Error sending invitation:', error);
            Alert.alert('Error', 'Failed to send invitation');
        } finally {
            setIsSending(false);
        }
    }, [token])


    const acceptInvitation = useCallback(async (invitationId: number) => {
        try {
            await fetch(`${API_BASE}/api/friend-requests/accept/${invitationId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            await loadData();
        } catch (error) {
            console.error('Error accepting invitation:', error);
        }
    }, [token, loadData]);

    const rejectInvitation = useCallback(async (invitationId: number) => {
        try {
            await fetch(`${API_BASE}/api/friend-requests/reject/${invitationId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            await loadData();
        } catch (error) {
            console.error('Error rejecting invitation:', error);
        }
    }, [token, loadData])


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