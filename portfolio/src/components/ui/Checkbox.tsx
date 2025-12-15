'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    id?: string;
    className?: string;
}

export function Checkbox({
    checked,
    onChange,
    label,
    id,
    className = '',
}: CheckboxProps) {
    const handleClick = () => {
        onChange(!checked);
    };

    return (
        <label
            htmlFor={id}
            className={`inline-flex items-center gap-3 cursor-pointer ${className}`}
        >
            <motion.button
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={handleClick}
                className={`
          relative w-5 h-5 rounded-md border-2 
          flex items-center justify-center
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-primary/50
          ${checked
                        ? 'bg-primary border-primary'
                        : 'bg-transparent border-foreground-muted hover:border-foreground'
                    }
        `}
                whileTap={{ scale: 0.9 }}
            >
                <motion.div
                    initial={false}
                    animate={{
                        scale: checked ? 1 : 0,
                        opacity: checked ? 1 : 0,
                    }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                >
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </motion.div>
            </motion.button>

            {label && (
                <span className={`
          text-sm transition-all duration-200
          ${checked
                        ? 'text-foreground-muted line-through'
                        : 'text-foreground'
                    }
        `}>
                    {label}
                </span>
            )}
        </label>
    );
}
