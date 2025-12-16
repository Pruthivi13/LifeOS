'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui';
import { CheckCircle, Flame, Droplets, Smile } from 'lucide-react';

interface AnalyticsCardProps {
    stats?: {
        completedTasks: number;
        totalTasks: number;
        habitStreak: number;
        hydrationGlasses?: number;
        todayMood?: number; // 1-5 scale
    };
}

export function AnalyticsCard({ stats }: AnalyticsCardProps) {
    // Calculate percentage for progress bar (safely)
    const taskProgress = stats && stats.totalTasks > 0
        ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
        : 0;

    const hydrationProgress = stats?.hydrationGlasses
        ? Math.round((stats.hydrationGlasses / 8) * 100)
        : 0;

    const getMoodEmoji = (mood?: number) => {
        if (!mood) return '😶';
        const emojis = ['😟', '😕', '😐', '🙂', '😊'];
        return emojis[Math.min(mood - 1, 4)];
    };

    // Generate dynamic motivational message
    const getMotivationalMessage = () => {
        if (!stats) return "Start tracking to see your progress!";

        const { completedTasks, totalTasks, habitStreak, hydrationGlasses = 0, todayMood = 0 } = stats;

        // Priority-based messages
        if (taskProgress === 100 && hydrationGlasses >= 8) {
            return "🌟 Perfect day! You're crushing it!";
        }
        if (todayMood >= 4 && habitStreak >= 3) {
            return "✨ Your consistency is paying off!";
        }
        if (taskProgress >= 75) {
            return "💪 Almost there! Keep pushing!";
        }
        if (habitStreak >= 5) {
            return "🔥 Incredible streak! Don't break it!";
        }
        if (hydrationGlasses >= 6) {
            return "💧 Great hydration! Stay refreshed!";
        }
        if (todayMood <= 2 && todayMood > 0) {
            return "💜 It's okay to have off days. Be kind to yourself.";
        }
        if (completedTasks > 0) {
            return "👍 Good start! Keep the momentum!";
        }
        return "🚀 Ready to make today great?";
    };

    return (
        <Card>
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
                Today's Progress
            </h3>

            {stats ? (
                <>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Task Progress */}
                        <motion.div
                            key={`tasks-${taskProgress}`}
                            initial={{ scale: 0.95, opacity: 0.8 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="p-3 bg-purple-500/5 dark:bg-purple-500/10 rounded-xl border border-purple-500/10"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <CheckCircle className="w-4 h-4 text-purple-500" />
                                <span className="text-xs font-medium text-purple-900 dark:text-purple-300">Tasks</span>
                            </div>
                            <motion.div
                                key={taskProgress}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                className="text-xl font-bold text-foreground"
                            >
                                {taskProgress}%
                            </motion.div>
                            <p className="text-xs text-foreground-muted">
                                {stats.completedTasks}/{stats.totalTasks}
                            </p>
                        </motion.div>

                        {/* Habit Streak */}
                        <motion.div
                            key={`streak-${stats.habitStreak}`}
                            initial={{ scale: 0.95, opacity: 0.8 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="p-3 bg-amber-500/5 dark:bg-amber-500/10 rounded-xl border border-amber-500/10"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <motion.div
                                    animate={{ rotate: stats.habitStreak > 0 ? [0, -10, 10, 0] : 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Flame className="w-4 h-4 text-amber-500" />
                                </motion.div>
                                <span className="text-xs font-medium text-amber-900 dark:text-amber-300">Streak</span>
                            </div>
                            <motion.div
                                key={stats.habitStreak}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                className="text-xl font-bold text-foreground"
                            >
                                {stats.habitStreak}
                            </motion.div>
                            <p className="text-xs text-foreground-muted">
                                days avg
                            </p>
                        </motion.div>

                        {/* Hydration */}
                        <motion.div
                            key={`water-${stats.hydrationGlasses}`}
                            initial={{ scale: 0.95, opacity: 0.8 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="p-3 bg-blue-500/5 dark:bg-blue-500/10 rounded-xl border border-blue-500/10"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <motion.div
                                    animate={{ y: [0, -3, 0] }}
                                    transition={{ duration: 0.3 }}
                                    key={stats.hydrationGlasses}
                                >
                                    <Droplets className="w-4 h-4 text-blue-500" />
                                </motion.div>
                                <span className="text-xs font-medium text-blue-900 dark:text-blue-300">Water</span>
                            </div>
                            <motion.div
                                key={`hydration-val-${stats.hydrationGlasses}`}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                className="text-xl font-bold text-foreground"
                            >
                                {stats.hydrationGlasses || 0}/8
                            </motion.div>
                            <p className="text-xs text-foreground-muted">
                                glasses
                            </p>
                        </motion.div>

                        {/* Today's Mood */}
                        <motion.div
                            key={`mood-${stats.todayMood}`}
                            initial={{ scale: 0.95, opacity: 0.8 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="p-3 bg-green-500/5 dark:bg-green-500/10 rounded-xl border border-green-500/10"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Smile className="w-4 h-4 text-green-500" />
                                <span className="text-xs font-medium text-green-900 dark:text-green-300">Mood</span>
                            </div>
                            <motion.div
                                key={`mood-emoji-${stats.todayMood}`}
                                initial={{ scale: 1.5, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                                className="text-xl font-bold text-foreground"
                            >
                                {getMoodEmoji(stats.todayMood)}
                            </motion.div>
                            <p className="text-xs text-foreground-muted">
                                today
                            </p>
                        </motion.div>
                    </div>

                    {/* Dynamic Motivational Message */}
                    <motion.div
                        key={getMotivationalMessage()}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-foreground/5 rounded-xl text-center"
                    >
                        <p className="text-sm text-foreground font-medium">
                            {getMotivationalMessage()}
                        </p>
                    </motion.div>
                </>
            ) : (
                <div className="p-4 bg-foreground/5 rounded-xl text-center">
                    <p className="text-sm text-foreground-muted italic">
                        Start tracking to see your progress!
                    </p>
                </div>
            )}
        </Card>
    );
}

