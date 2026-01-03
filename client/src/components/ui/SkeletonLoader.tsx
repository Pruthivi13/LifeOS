'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
}

// Base skeleton with shimmer effect
export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div
            className={`relative overflow-hidden bg-foreground/10 rounded ${className}`}
        >
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
        </div>
    );
}

// Text line skeleton
interface SkeletonTextProps {
    lines?: number;
    className?: string;
}

export function SkeletonText({ lines = 3, className = '' }: SkeletonTextProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
                />
            ))}
        </div>
    );
}

// Avatar skeleton
interface SkeletonAvatarProps {
    size?: 'sm' | 'md' | 'lg';
}

const avatarSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
};

export function SkeletonAvatar({ size = 'md' }: SkeletonAvatarProps) {
    return <Skeleton className={`${avatarSizes[size]} rounded-full`} />;
}

// Card skeleton for dashboard cards
export function SkeletonCard() {
    return (
        <div className="glass-card rounded-2xl p-6 border border-foreground/5">
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            <SkeletonText lines={3} />
            <div className="mt-4 flex gap-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
        </div>
    );
}

// Task item skeleton
export function SkeletonTaskItem() {
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-foreground/5">
            <Skeleton className="w-5 h-5 rounded" />
            <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    );
}
