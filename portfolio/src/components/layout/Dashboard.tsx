'use client';

import { ReactNode } from 'react';

import { Footer } from './Footer';

interface DashboardLayoutProps {
    children: ReactNode;
    header?: ReactNode;
}

export function DashboardLayout({ children, header }: DashboardLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen">
            {header}
            <main className="flex-1 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}

interface DashboardGridProps {
    children: ReactNode;
    className?: string;
}

export function DashboardGrid({ children, className = '' }: DashboardGridProps) {
    return (
        <div
            className={`
        grid gap-4
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        ${className}
      `}
        >
            {children}
        </div>
    );
}

// Column wrapper for controlling span
interface DashboardColumnProps {
    children: ReactNode;
    span?: 1 | 2 | 3;
    className?: string;
}

export function DashboardColumn({
    children,
    span = 1,
    className = '',
}: DashboardColumnProps) {
    const spanClasses = {
        1: '',
        2: 'md:col-span-2',
        3: 'lg:col-span-3',
    };

    return (
        <div className={`flex flex-col gap-6 ${spanClasses[span]} ${className}`}>
            {children}
        </div>
    );
}
