import {UserInfo} from "./friends/UserInfo";

export interface User {
    id: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    info: UserInfo;
}