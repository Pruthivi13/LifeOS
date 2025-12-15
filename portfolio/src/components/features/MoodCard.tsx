'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui';

interface MoodCardProps {
    score: number; // 0-100
    label: string; // "Good", "Great", etc.
    period?: string; // "This week"
}

export function MoodCard({ score, label, period = 'This week' }: MoodCardProps) {
    // Circle dimensions
    const size = 140;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

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
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        stroke="var(--soft-blue)"
                        fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    />
                </svg>

                {/* Score Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        className="text-4xl font-bold text-foreground"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        {score}
                    </motion.span>
                    <span className="text-xs text-foreground-muted">{period}</span>
                </div>
            </div>

            {/* Mood Label */}
            <motion.p
                className="mt-4 text-lg font-medium text-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                {label}
            </motion.p>
        </Card>
    );
}
