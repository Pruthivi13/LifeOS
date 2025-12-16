'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';

interface DropdownItem {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    danger?: boolean;
}

interface DropdownProps {
    items: DropdownItem[];
    trigger?: ReactNode;
}

export function Dropdown({ items, trigger }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-transparent text-foreground-muted hover:bg-foreground/5 hover:text-foreground transition-colors"
                aria-label="More options"
            >
                {trigger || <MoreHorizontal className="w-5 h-5" />}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 min-w-[160px] py-1 bg-background-secondary rounded-xl shadow-lg border border-foreground/10 z-50"
                    >
                        {items.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    item.onClick();
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-colors ${item.danger
                                        ? 'text-red-500 hover:bg-red-500/10'
                                        : 'text-foreground hover:bg-foreground/5'
                                    }`}
                            >
                                {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                                {item.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
