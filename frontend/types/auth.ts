export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    MEMBER = 'MEMBER',
}

export interface User {
    id: string;
    email: string;
    name?: string;
    role?: UserRole | string; // Allow string for backward compatibility or flexibility
    [key: string]: unknown;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken?: string;
}
