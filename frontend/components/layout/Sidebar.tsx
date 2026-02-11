'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Building2,
    FolderOpen,
    CheckSquare,
    Settings,
    LogOut,
    Menu,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { UserRole } from '@/types/auth';

const allSidebarItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER] },
    { href: '/dashboard/organizations', label: 'Organizations', icon: Building2, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN] },
    { href: '/dashboard/users', label: 'Users', icon: Users, roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { href: '/dashboard/projects', label: 'Projects', icon: FolderOpen, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER] },
    { href: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare, roles: [UserRole.MANAGER, UserRole.MEMBER] },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN] },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useSelector((state: RootState) => state.auth);

    const userRole = (user?.role as UserRole) || UserRole.MEMBER; // Default to MEMBER if undefined

    const sidebarItems = allSidebarItems.filter(item => item.roles.includes(userRole));

    return (
        <>
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r shadow-sm transition-transform duration-300 ease-in-out md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-16 items-center border-b px-6">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <span className="text-2xl">⚡</span>
                        <span>TaskSpare</span>
                    </Link>
                </div>
                <div className="flex flex-col h-[calc(100vh-4rem)] justify-between py-6 px-3">
                    <nav className="space-y-1">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="px-3">
                        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
