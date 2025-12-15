'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Droplets } from 'lucide-react';
import { Card, CardHeader, Button } from '@/components/ui';

export function HydrationCard() {
    const [glasses, setGlasses] = useState(0);
    const goal = 8; // Standard 8 glasses goal

    // Load from local storage on mount
    useEffect(() => {
        const savedData = localStorage.getItem('lifeos-hydration');
        if (savedData) {
            const { date, count } = JSON.parse(savedData);
            // Reset if it's a new day
            if (new Date(date).toDateString() !== new Date().toDateString()) {
                setGlasses(0);
            } else {
                setGlasses(count);
            }
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        const data = {
            date: new Date().toISOString(),
            count: glasses
        };
        localStorage.setItem('lifeos-hydration', JSON.stringify(data));
    }, [glasses]);

    const addGlass = () => {
        if (glasses < goal) setGlasses(prev => prev + 1);
    };

    const removeGlass = () => {
        if (glasses > 0) setGlasses(prev => prev - 1);
    };

    const percentage = Math.round((glasses / goal) * 100);

    return (
        <Card>
            <CardHeader
                title="Hydration"
                action={<Droplets className="w-5 h-5 text-soft-blue" />}
            />

            <div className="flex flex-col items-center justify-center space-y-6">
                {/* Visual Tracker */}
                <div className="relative w-full h-12 bg-foreground/5 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute left-0 top-0 bottom-0 bg-soft-blue/30"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ type: 'spring', stiffness: 60 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center gap-1">
                        {Array.from({ length: goal }).map((_, i) => (
                            <div
                                key={i}
                                className={`
                                    w-3 h-3 rounded-full transition-all duration-300
                                    ${i < glasses ? 'bg-soft-blue scale-110' : 'bg-foreground/20'}
                                `}
                            />
                        ))}
                    </div>
                </div>

                {/* Counter & Controls */}
                <div className="flex items-center gap-6">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={removeGlass}
                        disabled={glasses === 0}
                        icon={<Minus className="w-4 h-4" />}
                    />

                    <div className="text-center">
                        <span className="text-3xl font-bold text-foreground">{glasses}</span>
                        <span className="text-sm text-foreground-muted"> / {goal}</span>
                    </div>

                    <Button
                        variant="primary"
                        size="sm"
                        onClick={addGlass}
                        disabled={glasses === goal}
                        icon={<Plus className="w-4 h-4" />}
                    />
                </div>

                <p className="text-sm text-foreground-muted">
                    {glasses >= goal ? "Hydration goal reached! 🎉" : `${goal - glasses} more to go`}
                </p>
            </div>
        </Card>
    );
}
