'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    padding?: 'sm' | 'md' | 'lg';
}

const paddingClasses = {
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
};

export function Card({
    children,
    className = '',
    hover = true,
    padding = 'md'
}: CardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`
        glass-card 
        ${paddingClasses[padding]}
        ${hover ? 'hover:shadow-lg' : ''}
        ${className}
        h-full
      `}
        >
            {children}
        </motion.div>
    );
}

interface CardHeaderProps {
    title: string;
    action?: ReactNode;
    className?: string;
}

export function CardHeader({ title, action, className = '' }: CardHeaderProps) {
    return (
        <div className={`flex items-center justify-between mb-4 ${className}`}>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            {action && <div>{action}</div>}
        </div>
    );
}

interface CardContentProps {
    children: ReactNode;
    className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
    return <div className={className}>{children}</div>;
}
