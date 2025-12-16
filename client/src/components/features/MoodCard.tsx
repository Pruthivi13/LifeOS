'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui';

interface MoodCardProps {
    score: number; // 0-100
    label: string; // "Good", "Great", etc.
    period?: string; // "This week"
    todayMood?: number; // 1-5 scale for today
}

export function MoodCard({ score, label, period = 'This week', todayMood }: MoodCardProps) {
    // Circle dimensions
    const size = 140;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const getMoodEmoji = (mood?: number) => {
        if (!mood) return '😶';
        const emojis = ['😟', '😕', '😐', '🙂', '😊'];
        return emojis[Math.min(mood - 1, 4)];
    };

    // Color based on score
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'var(--mood-great)';
        if (score >= 60) return 'var(--soft-blue)';
        if (score >= 40) return 'var(--warm-amber)';
        return 'var(--soft-red)';
    };

    return (
        <Card className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-foreground mb-4">Mood</h3>

            {/* Progress Ring */}
            <div className="relative" style={{ width: size, height: size }}>
                <svg
                    className="progress-ring"
                    width={size}
                    height={size}
                >
                    {/* Background Circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        stroke="var(--foreground-muted)"
                        fill="transparent"
                        opacity={0.1}
                    />

                    {/* Progress Circle */}
                    <motion.circle
                        key={`mood-ring-${score}`}
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        stroke={getScoreColor(score)}
                        fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                </svg>

                {/* Score Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        key={`mood-score-${score}`}
                        className="text-4xl font-bold text-foreground"
                        initial={{ scale: 1.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        {score}
                    </motion.span>
                    <span className="text-xs text-foreground-muted">{period}</span>
                </div>
            </div>

            {/* Today's Mood Emoji */}
            {todayMood && (
                <motion.div
                    key={`today-mood-${todayMood}`}
                    initial={{ scale: 1.5, rotate: -15, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                    className="mt-2 text-2xl"
                >
                    {getMoodEmoji(todayMood)}
                </motion.div>
            )}

            {/* Mood Label */}
            <motion.p
                key={`mood-label-${label}`}
                className="mt-2 text-lg font-medium text-foreground"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {label}
            </motion.p>
        </Card>
    );
}

