'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16'
};

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
    return (
        <motion.div
            className={`${sizeMap[size]} ${className}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
            <svg
                className="w-full h-full"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
        </motion.div>
    );
}

// Full page loading overlay
interface LoadingOverlayProps {
    message?: string;
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
        >
            <LoadingSpinner size="xl" className="text-primary mb-4" />
            <p className="text-foreground-muted animate-pulse">{message}</p>
        </motion.div>
    );
}

// Inline loading dots
export function LoadingDots() {
    return (
        <span className="inline-flex gap-1 items-center">
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-current"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                    }}
                />
            ))}
        </span>
    );
}
