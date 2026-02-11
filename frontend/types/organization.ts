export interface Organization {
    id: string;
    name: string;
    role?: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
}
