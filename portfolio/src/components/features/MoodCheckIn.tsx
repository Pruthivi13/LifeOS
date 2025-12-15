'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader } from '@/components/ui';
import { MoodLevel, moodEmojis } from '@/types';

interface MoodCheckInProps {
    onSelectMood?: (mood: MoodLevel) => void;
    weeklyInsight?: string;
}

export function MoodCheckIn({
    onSelectMood,
    weeklyInsight = "You're off to a great start. Keep building momentum!"
}: MoodCheckInProps) {
    const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);

    const handleSelectMood = (mood: MoodLevel) => {
        setSelectedMood(mood);
        onSelectMood?.(mood);
    };

    // Mood levels to display (from reference: 😐 🙂 😊 😄)
    const moodOptions: MoodLevel[] = [2, 3, 4, 5];

    return (
        <Card>
            <CardHeader title="Mood" />

            {/* Emoji Picker */}
            <div className="flex justify-center gap-3 mb-6">
                {moodOptions.map((mood, index) => (
                    <motion.button
                        key={index}
                        onClick={() => handleSelectMood(mood)}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
              w-12 h-12 rounded-full text-2xl
              flex items-center justify-center
              transition-all duration-200
              ${selectedMood === mood
                                ? 'bg-primary/20 ring-2 ring-primary'
                                : 'bg-foreground/5 hover:bg-foreground/10'
                            }
            `}
                    >
                        {moodEmojis[mood]}
                    </motion.button>
                ))}
            </div>

            {/* Weekly Insight */}
            <div className="pt-4 border-t border-foreground/5">
                <h4 className="text-sm font-semibold text-foreground mb-2">Weekly insight</h4>
                <p className="text-sm text-foreground-muted leading-relaxed">
                    {weeklyInsight}
                </p>
            </div>
        </Card>
    );
}
