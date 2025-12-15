'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { Search } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', icon, error, ...props }, ref) => {
        return (
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={`
            w-full px-4 py-2.5
            ${icon ? 'pl-10' : ''}
            bg-background-secondary
            border border-foreground/10
            rounded-xl
            text-foreground text-sm
            placeholder:text-foreground-muted
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
            transition-all duration-200
            ${error ? 'border-soft-red focus:ring-soft-red/30' : ''}
            ${className}
          `}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-xs text-soft-red">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

// Search Input Variant
interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
    onSearch?: (value: string) => void;
}

export function SearchInput({
    className = '',
    placeholder = 'Search tasks, habits, notes',
    ...props
}: SearchInputProps) {
    return (
        <Input
            icon={<Search className="w-4 h-4" />}
            placeholder={placeholder}
            className={`
                bg-foreground/5 dark:bg-foreground/10 
                border-transparent 
                focus:bg-background-secondary 
                focus:border-primary/50
                ${className}
            `}
            {...props}
        />
    );
}
