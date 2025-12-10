export interface FriendInvitation {
    id: number;
    sender_id: string;
    receiver_id: string;
    status: 'pending' | 'rejected';
    responded_at: string;
    created_at: string;
    updated_at: string;
}