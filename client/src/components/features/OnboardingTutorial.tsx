'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, Sparkles } from 'lucide-react';
import { useOnboarding, ONBOARDING_STEPS } from '@/context/OnboardingContext';
import { Button } from '@/components/ui';

export function OnboardingTutorial() {
    const {
        showTutorial,
        currentStep,
        totalSteps,
        currentStepData,
        nextStep,
        prevStep,
        skipTutorial,
        goToStep
    } = useOnboarding();

    if (!showTutorial) return null;

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === totalSteps - 1;

    return (
        <AnimatePresence>
            {showTutorial && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="w-full max-w-lg pointer-events-auto"
                        >
                            <div className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl bg-background/95 backdrop-blur-xl">
                                {/* Header with gradient */}
                                <div className="relative p-6 pb-4 bg-gradient-to-br from-primary/20 via-secondary-sage/10 to-secondary-amber/10">
                                    {/* Skip button */}
                                    <button
                                        onClick={skipTutorial}
                                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-foreground/10 transition-colors text-foreground-muted hover:text-foreground"
                                        aria-label="Skip tutorial"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    {/* Icon */}
                                    <motion.div
                                        key={currentStep}
                                        initial={{ scale: 0.5, rotate: -10 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                        className="w-20 h-20 mx-auto mb-4 flex items-center justify-center text-5xl bg-background/50 rounded-2xl border border-white/20 shadow-lg"
                                    >
                                        {currentStepData.icon}
                                    </motion.div>

                                    {/* Title with Sparkles (only on welcome) */}
                                    <div className="text-center">
                                        <motion.h2
                                            key={`title-${currentStep}`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-2xl font-bold text-foreground flex items-center justify-center gap-2"
                                        >
                                            {isFirstStep && <Sparkles className="w-5 h-5 text-primary" />}
                                            {currentStepData.title}
                                            {isFirstStep && <Sparkles className="w-5 h-5 text-primary" />}
                                        </motion.h2>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 pt-4">
                                    <motion.p
                                        key={`desc-${currentStep}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-center text-foreground-muted text-base leading-relaxed mb-6"
                                    >
                                        {currentStepData.description}
                                    </motion.p>

                                    {/* Step Indicators */}
                                    <div className="flex items-center justify-center gap-2 mb-6">
                                        {ONBOARDING_STEPS.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => goToStep(index)}
                                                className={`
                                                    h-2 rounded-full transition-all duration-300
                                                    ${index === currentStep
                                                        ? 'w-8 bg-primary'
                                                        : index < currentStep
                                                            ? 'w-2 bg-primary/50'
                                                            : 'w-2 bg-foreground/20'
                                                    }
                                                `}
                                                aria-label={`Go to step ${index + 1}`}
                                            />
                                        ))}
                                    </div>

                                    {/* Navigation Buttons */}
                                    <div className="flex items-center justify-between gap-4">
                                        <Button
                                            variant="secondary"
                                            onClick={prevStep}
                                            disabled={isFirstStep}
                                            className={`flex items-center gap-2 ${isFirstStep ? 'opacity-0 pointer-events-none' : ''}`}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Back
                                        </Button>

                                        <span className="text-sm text-foreground-muted">
                                            {currentStep + 1} / {totalSteps}
                                        </span>

                                        <Button
                                            variant="primary"
                                            onClick={nextStep}
                                            className="flex items-center gap-2"
                                        >
                                            {isLastStep ? 'Get Started' : 'Next'}
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
