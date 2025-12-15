'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui';

interface AnalyticsCardProps {
    quote?: string;
    subtext?: string;
}

export function AnalyticsCard({
    quote = "You're off to a great start.",
    subtext = "Keep building momentum.",
    stats
}: AnalyticsCardProps & { stats?: { completedTasks: number; totalTasks: number; habitStreak: number } }) {

    // Calculate percentage for progress bar (safely)
    const taskProgress = stats && stats.totalTasks > 0
        ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
        : 0;

    return (
        <Card>
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
                Productivity Analysis
            </h3>

            <div className="grid grid-cols-2 gap-4">
                {stats ? (
                    <>
                        {/* Task Progress */}
                        <div className="p-3 bg-purple-500/5 dark:bg-purple-500/10 rounded-xl border border-purple-500/10">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="p-1.5 bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </span>
                                <span className="text-sm font-medium text-purple-900 dark:text-purple-300">Tasks</span>
                            </div>
                            <div className="text-2xl font-bold text-foreground mb-1">
                                {taskProgress}%
                            </div>
                            <p className="text-xs text-foreground-muted">
                                {stats.completedTasks} of {stats.totalTasks} completed
                            </p>
                        </div>

                        {/* Habit Streak */}
                        <div className="p-3 bg-amber-500/5 dark:bg-amber-500/10 rounded-xl border border-amber-500/10">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="p-1.5 bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                                    </svg>
                                </span>
                                <span className="text-sm font-medium text-amber-900 dark:text-amber-300">Streak</span>
                            </div>
                            <div className="text-2xl font-bold text-foreground mb-1">
                                {stats.habitStreak}
                            </div>
                            <p className="text-xs text-foreground-muted">
                                day avg consistency
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-foreground/5 p-4 rounded-xl"
                        >
                            <p className="text-sm text-foreground leading-relaxed italic text-center">
                                "{quote}"
                            </p>
                        </motion.div>
                    </div>
                )}
            </div>
        </Card>
    );
}
