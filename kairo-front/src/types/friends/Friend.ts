import {UserInfo} from '@/src/types/friends/UserInfo';

export interface Friend {
    id: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    info: UserInfo;
}