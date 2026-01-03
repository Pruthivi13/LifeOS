// Sample data for new user onboarding
// These provide beginner-friendly examples with tips

export interface SampleTask {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    category: 'academic' | 'personal' | 'health' | 'work';
}

export interface SampleHabit {
    name: string;
    icon: string;
    frequency: 'daily' | 'weekly';
    description: string;
}

export const sampleTasks: SampleTask[] = [
    {
        title: '🌟 Welcome to LifeOS!',
        description: 'This is your first task! Tip: Click the checkbox on the left to mark it complete. Try it now!',
        priority: 'high',
        category: 'personal'
    },
    {
        title: '💧 Drink 8 glasses of water',
        description: 'Tip: Use the Hydration card below to track your water intake. Stay hydrated for better focus!',
        priority: 'medium',
        category: 'health'
    },
    {
        title: '🎯 Create your first habit',
        description: 'Tip: Click the + button on the Habits card to add a new daily habit. Start with something small!',
        priority: 'medium',
        category: 'personal'
    },
    {
        title: '📊 Check your analytics',
        description: 'Tip: The Analytics card shows your productivity stats. Complete tasks to see your progress grow!',
        priority: 'low',
        category: 'personal'
    }
];

export const sampleHabits: SampleHabit[] = [
    {
        name: 'Drink Water',
        icon: '💧',
        frequency: 'daily',
        description: 'Stay hydrated! Aim for 8 glasses throughout the day.'
    },
    {
        name: 'Morning Stretch',
        icon: '🧘',
        frequency: 'daily',
        description: 'Start your day with 5 minutes of stretching for energy.'
    },
    {
        name: 'Read 10 Pages',
        icon: '📚',
        frequency: 'daily',
        description: 'Build a reading habit. Knowledge compounds over time!'
    }
];

// Tips to show for different features
export const featureTips = {
    tasks: {
        id: 'tasks-tip',
        title: 'Task Tips',
        tips: [
            'Use priorities to focus on what matters most',
            'Categories help organize your tasks by area of life',
            'Set due dates to stay on track',
            'Click on a task to edit its details'
        ]
    },
    habits: {
        id: 'habits-tip',
        title: 'Habit Tips',
        tips: [
            'Start with just 1-2 habits to build consistency',
            'Your streak shows consecutive days completed',
            'Missing one day doesn\'t reset your progress!',
            'Daily habits are easier to maintain than weekly ones'
        ]
    },
    hydration: {
        id: 'hydration-tip',
        title: 'Hydration Tips',
        tips: [
            'Aim for 8 glasses (2 liters) per day',
            'Drink a glass first thing in the morning',
            'Keep a water bottle at your desk',
            'You\'ll receive reminders every 2 hours'
        ]
    },
    mood: {
        id: 'mood-tip',
        title: 'Mood Tracking Tips',
        tips: [
            'Check in with yourself daily',
            'Your mood affects your productivity',
            'Patterns emerge over time - watch for trends',
            'It\'s okay to have low days - be kind to yourself'
        ]
    },
    analytics: {
        id: 'analytics-tip',
        title: 'Analytics Tips',
        tips: [
            'Your wellness score combines all metrics',
            'Complete tasks to boost your productivity score',
            'Consistent habits improve your overall score',
            'Hydration and mood also factor into wellness'
        ]
    }
};

// Hydration reminder messages with variety
export const hydrationReminderMessages = [
    { title: '💧 Time for Water!', body: 'Stay refreshed! A glass of water boosts your energy and focus.' },
    { title: '💧 Hydration Check', body: 'Your body needs water to function at its best. Take a sip!' },
    { title: '💧 Water Break!', body: 'Pause and hydrate. Your future self will thank you!' },
    { title: '💧 Drink Up!', body: 'Staying hydrated helps you stay productive. Grab that water!' },
    { title: '💧 H2O Time', body: 'Regular hydration = better concentration. Time for a refill!' },
    { title: '💧 Refresh Yourself', body: 'A quick water break can help reset your focus. Stay hydrated!' }
];

// Get a random hydration message
export function getRandomHydrationMessage() {
    const index = Math.floor(Math.random() * hydrationReminderMessages.length);
    return hydrationReminderMessages[index];
}
