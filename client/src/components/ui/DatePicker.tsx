'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
    className?: string;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export function DatePicker({ value, onChange, className = '' }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedDate = value ? new Date(value) : null;

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Initialize current month from value
    useEffect(() => {
        if (value) {
            setCurrentMonth(new Date(value));
        }
    }, [value]);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days: (number | null)[] = [];

        // Add empty slots for days before the first day
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }

        // Add the days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        return days;
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handleSelectDate = (day: number) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const formattedDate = newDate.toISOString().split('T')[0];
        onChange(formattedDate);
        setIsOpen(false);
    };

    const handleToday = () => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        onChange(formattedDate);
        setCurrentMonth(today);
        setIsOpen(false);
    };

    const isToday = (day: number) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            currentMonth.getMonth() === today.getMonth() &&
            currentMonth.getFullYear() === today.getFullYear()
        );
    };

    const isSelected = (day: number) => {
        if (!selectedDate) return false;
        return (
            day === selectedDate.getDate() &&
            currentMonth.getMonth() === selectedDate.getMonth() &&
            currentMonth.getFullYear() === selectedDate.getFullYear()
        );
    };

    const formatDisplayDate = (dateStr: string) => {
        if (!dateStr) return 'Select date';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const days = getDaysInMonth(currentMonth);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Input Display */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-10 px-3 pr-10 rounded-xl bg-background-secondary border border-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm text-left cursor-pointer hover:border-foreground/30 transition-colors"
            >
                <span className={value ? 'text-foreground' : 'text-foreground-muted'}>
                    {formatDisplayDate(value)}
                </span>
            </button>
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted pointer-events-none" />

            {/* Calendar Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-0 mb-2 z-50 w-72 p-4 rounded-xl bg-background-secondary border border-foreground/10 shadow-xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <button
                                type="button"
                                onClick={handlePrevMonth}
                                className="p-1.5 rounded-lg hover:bg-foreground/10 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-foreground-muted" />
                            </button>
                            <span className="text-sm font-medium text-foreground">
                                {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </span>
                            <button
                                type="button"
                                onClick={handleNextMonth}
                                className="p-1.5 rounded-lg hover:bg-foreground/10 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-foreground-muted" />
                            </button>
                        </div>

                        {/* Weekday Headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {DAYS.map((day) => (
                                <div key={day} className="text-center text-xs font-medium text-foreground-muted py-1">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {days.map((day, index) => (
                                <div key={index} className="aspect-square">
                                    {day !== null && (
                                        <button
                                            type="button"
                                            onClick={() => handleSelectDate(day)}
                                            className={`
                                                w-full h-full rounded-lg text-sm font-medium transition-all
                                                ${isSelected(day)
                                                    ? 'bg-primary text-white'
                                                    : isToday(day)
                                                        ? 'bg-primary/20 text-primary border border-primary/50'
                                                        : 'text-foreground hover:bg-foreground/10'
                                                }
                                            `}
                                        >
                                            {day}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-foreground/10">
                            <button
                                type="button"
                                onClick={() => {
                                    onChange('');
                                    setIsOpen(false);
                                }}
                                className="text-xs text-foreground-muted hover:text-foreground transition-colors"
                            >
                                Clear
                            </button>
                            <button
                                type="button"
                                onClick={handleToday}
                                className="text-xs text-primary hover:text-primary-light font-medium transition-colors"
                            >
                                Today
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
