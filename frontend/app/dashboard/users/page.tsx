'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRole } from '@/types/auth';
import { MoreHorizontal, Shield, UserX, Mail } from 'lucide-react';

// Mock data until backend endpoint is available
const mockUsers = [
    { id: '1', name: 'Alice Admin', email: 'alice@example.com', role: UserRole.ADMIN, status: 'Active' },
    { id: '2', name: 'Bob Manager', email: 'bob@example.com', role: UserRole.MANAGER, status: 'Active' },
    { id: '3', name: 'Charlie Member', email: 'charlie@example.com', role: UserRole.MEMBER, status: 'Active' },
    { id: '4', name: 'Dave Member', email: 'dave@example.com', role: UserRole.MEMBER, status: 'Inactive' },
];

export default function UsersPage() {
    const [users] = useState(mockUsers);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">Manage your organization's team members.</p>
                </div>
                <Button>Invite User</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {users.map((user) => (
                            <div key={user.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-medium">{user.name}</div>
                                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Mail className="h-3 w-3" /> {user.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' :
                                        user.role === UserRole.MANAGER ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {user.role}
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {user.status}
                                    </div>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
