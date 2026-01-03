'use client';


import { MoreHorizontal, Plus, ListChecks, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardHeader, IconButton, Button, Dropdown } from '@/components/ui';
import { Habit } from '@/types';

interface HabitsCardProps {
    habits: Habit[];
    onCompleteHabit?: (habitId: string, date: Date) => void;
    onAddHabit?: () => void;
    onEditHabit?: (habit: Habit) => void;
    onDeleteHabit?: (habitId: string) => void;
}

export function HabitsCard({ habits, onCompleteHabit, onAddHabit, onEditHabit, onDeleteHabit }: HabitsCardProps) {
    // Get the last 7 days for streak display
    const getWeekDays = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date);
        }
        return days;
    };

    const weekDays = getWeekDays();

    const isCompletedOnDate = (habit: Habit, date: Date) => {
        return habit.completedDates.some(
            (d) => new Date(d).toDateString() === date.toDateString()
        );
    };

    // Emoji for completed days (from reference image)
    const getMoodEmoji = (index: number) => {
        const emojis = ['😐', '🙂', '😊', '😊', '🙂', '😐', '😊'];
        return emojis[index % emojis.length];
    };

    const dropdownItems = [
        {
            label: 'Add Habit',
            icon: <Plus className="w-4 h-4" />,
            onClick: () => onAddHabit?.(),
        },
        {
            label: 'View All Habits',
            icon: <ListChecks className="w-4 h-4" />,
            onClick: () => console.log('View all habits'),
        },
    ];

    return (
        <Card>
            <CardHeader
                title="Habits"
                action={<Dropdown items={dropdownItems} />}
            />

            <div className="space-y-4">
                {habits.map((habit, habitIndex) => (
                    <motion.div
                        key={habit._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: habitIndex * 0.1 }}
                        className="space-y-2 group"
                    >
                        {/* Habit Name and Actions */}
                        <div className="flex items-center justify-between">
                            <p
                                className="text-sm font-medium text-foreground cursor-pointer flex-1"
                                onClick={() => onEditHabit?.(habit)}
                            >
                                {habit.name}
                            </p>
                            <div className="flex items-center gap-1">
                                <IconButton
                                    icon={<MoreHorizontal className="w-4 h-4" />}
                                    label="Edit habit"
                                    size="sm"
                                    onClick={() => onEditHabit?.(habit)}
                                    className="md:opacity-0 md:group-hover:opacity-100 transition-opacity hidden md:flex"
                                />
                                <button
                                    onClick={() => onDeleteHabit?.(habit._id)}
                                    className="p-1.5 rounded-lg text-foreground-muted hover:text-red-500 hover:bg-red-500/10 md:opacity-0 md:group-hover:opacity-100 transition-all hidden md:block"
                                    title="Delete habit"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Streak Bar */}
                        <div className="streak-bar">
                            {weekDays.map((day, dayIndex) => {
                                const completed = isCompletedOnDate(habit, day);
                                const isToday = day.toDateString() === new Date().toDateString();

                                return (
                                    <motion.button
                                        key={dayIndex}
                                        onClick={() => onCompleteHabit?.(habit._id, day)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`
                      streak-day
                      ${completed ? 'streak-day--completed' : 'streak-day--missed'}
                      ${!completed ? 'hover:bg-foreground/5 cursor-pointer' : 'cursor-pointer'}
                    `}
                                    >
                                        {completed && (
                                            <span className="text-xs">{getMoodEmoji(dayIndex)}</span>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-foreground/5">
                <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    icon={<Plus className="w-4 h-4" />}
                    onClick={onAddHabit}
                >
                    Add habit
                </Button>
            </div>
        </Card>
    );
}
