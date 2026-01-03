'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X, ChevronRight, ChevronLeft } from 'lucide-react';

interface FeatureTipProps {
    tipId: string;
    title: string;
    tips: string[];
    onDismiss?: () => void;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

export function FeatureTip({ tipId, title, tips, onDismiss, position = 'bottom' }: FeatureTipProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [currentTip, setCurrentTip] = useState(0);

    const handleDismiss = () => {
        setIsVisible(false);
        onDismiss?.();
    };

    const nextTip = () => {
        if (currentTip < tips.length - 1) {
            setCurrentTip(prev => prev + 1);
        } else {
            handleDismiss();
        }
    };

    const prevTip = () => {
        if (currentTip > 0) {
            setCurrentTip(prev => prev - 1);
        }
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: position === 'top' ? -10 : 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: position === 'top' ? -10 : 10, scale: 0.95 }}
                    className="absolute z-40 w-72"
                    style={{
                        [position === 'top' ? 'bottom' : 'top']: 'calc(100% + 12px)',
                        left: '50%',
                        transform: 'translateX(-50%)'
                    }}
                    data-tip-id={tipId}
                >
                    <div className="relative bg-primary/95 text-white rounded-xl p-4 shadow-xl border border-white/20 backdrop-blur-sm">
                        {/* Arrow */}
                        <div
                            className={`
                                absolute w-3 h-3 bg-primary/95 rotate-45
                                ${position === 'top' ? 'bottom-[-6px]' : 'top-[-6px]'}
                                left-1/2 -translate-x-1/2
                            `}
                        />

                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Lightbulb className="w-4 h-4" />
                                <span className="font-semibold text-sm">{title}</span>
                            </div>
                            <button
                                onClick={handleDismiss}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                                aria-label="Close tip"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Tip Content */}
                        <motion.p
                            key={currentTip}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-white/90 mb-3"
                        >
                            {tips[currentTip]}
                        </motion.p>

                        {/* Navigation */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={prevTip}
                                disabled={currentTip === 0}
                                className={`
                                    p-1 rounded transition-colors
                                    ${currentTip === 0
                                        ? 'opacity-30 cursor-not-allowed'
                                        : 'hover:bg-white/20'
                                    }
                                `}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <div className="flex gap-1">
                                {tips.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`
                                            w-1.5 h-1.5 rounded-full transition-all
                                            ${index === currentTip ? 'bg-white' : 'bg-white/40'}
                                        `}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={nextTip}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Simple tooltip version for quick tips
interface QuickTipProps {
    text: string;
    visible: boolean;
}

export function QuickTip({ text, visible }: QuickTipProps) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute z-30 top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
                >
                    <div className="bg-foreground text-background text-xs px-3 py-1.5 rounded-lg shadow-lg">
                        {text}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
