'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd'> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    icon?: ReactNode;
}

const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-background-secondary text-foreground hover:bg-foreground/10',
    ghost: 'bg-transparent text-foreground-muted hover:bg-foreground/5',
    outline: 'bg-transparent border border-foreground/20 text-foreground hover:bg-foreground/5',
};

const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
};

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    icon,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            className={`
        inline-flex items-center justify-center gap-2
        rounded-full font-medium
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-primary/50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
            disabled={disabled}
            {...props}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </motion.button>
    );
}

// Icon-only button variant
// Icon-only button variant
interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd'> {
    icon: ReactNode;
    label: string;
    size?: 'sm' | 'md' | 'lg';
}

const iconSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
};

export function IconButton({
    icon,
    label,
    size = 'md',
    className = '',
    ...props
}: IconButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={label}
            className={`
        inline-flex items-center justify-center
        rounded-full
        bg-transparent text-foreground-muted
        hover:bg-foreground/5 hover:text-foreground
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-primary/50
        ${iconSizeClasses[size]}
        ${className}
      `}
            {...props}
        >
            {icon}
        </motion.button>
    );
}
