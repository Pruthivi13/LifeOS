'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    icon: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        id: 'welcome',
        title: 'Welcome to LifeOS! 🎉',
        description: 'Your personal productivity companion. Let\'s take a quick tour to help you get started.',
        icon: '👋'
    },
    {
        id: 'tasks',
        title: 'Task Management 📝',
        description: 'Create and organize your tasks by priority and category. Click the + button to add new tasks, and check them off as you complete them!',
        icon: '✅'
    },
    {
        id: 'habits',
        title: 'Habit Tracking 🎯',
        description: 'Build positive routines! Track daily habits and watch your streak grow. Consistency is key to success.',
        icon: '🔥'
    },
    {
        id: 'hydration',
        title: 'Stay Hydrated 💧',
        description: 'Track your daily water intake with the hydration card. Aim for 8 glasses a day! You\'ll receive gentle reminders to drink water.',
        icon: '💧'
    },
    {
        id: 'mood',
        title: 'Mood Tracking 😊',
        description: 'Log how you\'re feeling each day. Understanding your emotions helps improve your overall wellbeing.',
        icon: '🌈'
    },
    {
        id: 'analytics',
        title: 'Your Progress 📊',
        description: 'View your wellness score and track your productivity trends. The analytics card shows your overall progress!',
        icon: '📈'
    }
];

interface OnboardingContextType {
    isFirstTimeUser: boolean;
    showTutorial: boolean;
    currentStep: number;
    totalSteps: number;
    currentStepData: OnboardingStep;
    startTutorial: () => void;
    completeTutorial: () => void;
    nextStep: () => void;
    prevStep: () => void;
    skipTutorial: () => void;
    goToStep: (step: number) => void;
    hasSeenFeatureTip: (tipId: string) => boolean;
    markFeatureTipSeen: (tipId: string) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const ONBOARDING_STORAGE_KEY = 'lifeos-onboarding';
const FEATURE_TIPS_KEY = 'lifeos-feature-tips';

export function OnboardingProvider({ children }: { children: ReactNode }) {
    const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [seenFeatureTips, setSeenFeatureTips] = useState<Set<string>>(new Set());

    // Check if user has completed onboarding
    useEffect(() => {
        const onboardingData = localStorage.getItem(ONBOARDING_STORAGE_KEY);
        const featureTips = localStorage.getItem(FEATURE_TIPS_KEY);

        if (!onboardingData) {
            setIsFirstTimeUser(true);
            setShowTutorial(true);
        } else {
            const data = JSON.parse(onboardingData);
            setIsFirstTimeUser(!data.completed);
        }

        if (featureTips) {
            setSeenFeatureTips(new Set(JSON.parse(featureTips)));
        }
    }, []);

    const startTutorial = useCallback(() => {
        setShowTutorial(true);
        setCurrentStep(0);
    }, []);

    const completeTutorial = useCallback(() => {
        setShowTutorial(false);
        setIsFirstTimeUser(false);
        localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify({
            completed: true,
            completedAt: new Date().toISOString()
        }));
    }, []);

    const skipTutorial = useCallback(() => {
        completeTutorial();
    }, [completeTutorial]);

    const nextStep = useCallback(() => {
        if (currentStep < ONBOARDING_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            completeTutorial();
        }
    }, [currentStep, completeTutorial]);

    const prevStep = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    }, [currentStep]);

    const goToStep = useCallback((step: number) => {
        if (step >= 0 && step < ONBOARDING_STEPS.length) {
            setCurrentStep(step);
        }
    }, []);

    const hasSeenFeatureTip = useCallback((tipId: string) => {
        return seenFeatureTips.has(tipId);
    }, [seenFeatureTips]);

    const markFeatureTipSeen = useCallback((tipId: string) => {
        setSeenFeatureTips(prev => {
            const newSet = new Set(prev);
            newSet.add(tipId);
            localStorage.setItem(FEATURE_TIPS_KEY, JSON.stringify([...newSet]));
            return newSet;
        });
    }, []);

    const currentStepData = ONBOARDING_STEPS[currentStep];

    return (
        <OnboardingContext.Provider value={{
            isFirstTimeUser,
            showTutorial,
            currentStep,
            totalSteps: ONBOARDING_STEPS.length,
            currentStepData,
            startTutorial,
            completeTutorial,
            nextStep,
            prevStep,
            skipTutorial,
            goToStep,
            hasSeenFeatureTip,
            markFeatureTipSeen,
        }}>
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (context === undefined) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
}
