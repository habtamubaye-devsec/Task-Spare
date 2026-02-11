'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { UserRole } from '@/types/auth';
import { Building2, FolderOpen, CheckSquare, Users } from 'lucide-react';

export default function DashboardPage() {
    const { user } = useSelector((state: RootState) => state.auth);
    const userRole = (user?.role as UserRole) || UserRole.MEMBER;

    const stats = [
        {
            title: 'Total Projects',
            value: '12',
            icon: FolderOpen,
            description: '+2 from last month',
            roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER],
        },
        {
            title: 'Active Tasks',
            value: '24',
            icon: CheckSquare,
            description: '5 due today',
            roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER],
        },
        {
            title: 'Team Members',
            value: '8',
            icon: Users,
            description: 'Active users',
            roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER],
        },
        {
            title: 'Organizations',
            value: '3',
            icon: Building2,
            description: 'Managed organizations',
            roles: [UserRole.SUPER_ADMIN],
        },
    ];

    const visibleStats = stats.filter(stat => stat.roles.includes(userRole));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back, {user?.name || 'User'}! Here's an overview of your workspace.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {visibleStats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
            
            {/* Placeholder for Graphs/Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Project Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md">
                        <p className="text-muted-foreground">Project Graph Placeholder</p>
                    </CardContent>
                </Card>
                <Card className="col-span-1">
                     <CardHeader>
                        <CardTitle>Task Completion</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md">
                        <p className="text-muted-foreground">Task Graph Placeholder</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
