'use client';

import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Removed unused imports for DropdownMenu
import { useState } from 'react';

export function Header({ mobileMenuTrigger }: { mobileMenuTrigger?: React.ReactNode }) {
    return (
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 shadow-sm md:px-6">
            {mobileMenuTrigger}

            <div className="hidden md:flex flex-1 items-center gap-4 max-w-md">
                <div className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search projects..."
                        className="w-full bg-background pl-8 shadow-none md:w-2/3 lg:w-full"
                    />
                </div>
            </div>

            <div className="flex flex-1 items-center justify-end gap-x-4 ml-auto">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        U
                    </div>
                    <span className="sr-only">User menu</span>
                </Button>
            </div>
        </header>
    );
}
