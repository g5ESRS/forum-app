export interface BaseUser {
    id: number;
    username: string;
    email: string;
}

export interface UserDetails extends BaseUser {
    groups: Group[];
    user_permissions: Permission[];
    permissions: Permission[];
}

export interface Permission {
    id: number;
    name: string;
    codename: string;
    content_type: number;
}

export interface Group {
    id: number;
    name: string;
    permissions: Permission[];
}