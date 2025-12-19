'use client';

import { Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SearchInput, Avatar, IconButton, NotificationButton } from '@/components/ui';

interface HeaderProps {
    userName?: string;
    userAvatar?: string;
    isDarkMode?: boolean;
    onToggleDarkMode?: () => void;
}

export function Header({
    userName = 'User',
    userAvatar,
    isDarkMode = false,
    onToggleDarkMode,
}: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full">
            <div className="bg-background/70 backdrop-blur-xl border-b border-foreground/5 transition-all duration-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between gap-8">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center gap-1">
                                <Image
                                    src="/logo.png"
                                    alt="LifeOS Logo"
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                />
                                <h1 className="text-xl font-semibold text-foreground tracking-tight cursor-pointer">
                                    LifeOS
                                </h1>
                            </Link>
                        </div>

                        {/* Search Bar - Center */}
                        <div className="flex-1 max-w-md hidden sm:block">
                            <SearchInput
                                placeholder="Search tasks, habits, notes"
                                className="w-full"
                            />
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            <NotificationButton />

                            {/* Dark Mode Toggle */}
                            <IconButton
                                icon={isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                                onClick={onToggleDarkMode}
                            />

                            {/* Profile Avatar */}
                            <Link href="/profile">
                                <Avatar
                                    src={userAvatar}
                                    name={userName}
                                    size="md"
                                    className="cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
