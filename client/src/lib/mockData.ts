// LifeOS Mock Data - Matching the reference design

import { Task, Habit, MoodEntry, WeeklySummary } from '@/types';

// Today's date for relative calculations
const today = new Date();
const formatDate = (daysFromNow: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() + daysFromNow);
    return date;
};

// Mock Tasks
export const mockTasks: Task[] = [
    {
        _id: '1',
        userId: 'user1',
        title: 'Complete project report',
        description: 'Finish the semester project report',
        priority: 'high',
        category: 'academic',
        dueDate: today,
        completed: false,
        createdAt: formatDate(-2),
    },
    {
        _id: '2',
        userId: 'user1',
        title: 'Review lecture notes',
        description: 'Review notes for upcoming exam',
        priority: 'medium',
        category: 'academic',
        dueDate: today,
        completed: false,
        createdAt: formatDate(-1),
    },
    {
        _id: '3',
        userId: 'user1',
        title: 'Exercise',
        description: '30 minutes workout',
        priority: 'medium',
        category: 'health',
        dueDate: today,
        completed: false,
        createdAt: formatDate(-1),
    },
    {
        _id: '4',
        userId: 'user1',
        title: 'Read a book',
        description: 'Read at least 20 pages',
        priority: 'low',
        category: 'personal',
        dueDate: formatDate(11), // April 26 from image
        completed: false,
        createdAt: formatDate(-5),
    },
];

// Mock Habits with streak data
export const mockHabits: Habit[] = [
    {
        _id: '1',
        userId: 'user1',
        name: 'Study',
        icon: 'book-open',
        frequency: 'daily',
        streakCount: 6,
        completedDates: [
            formatDate(-6),
            formatDate(-5),
            formatDate(-4),
            formatDate(-3),
            formatDate(-2),
            formatDate(-1),
        ],
        createdAt: formatDate(-30),
    },
    {
        _id: '2',
        userId: 'user1',
        name: 'Run',
        icon: 'running',
        frequency: 'daily',
        streakCount: 4,
        completedDates: [
            formatDate(-5),
            formatDate(-3),
            formatDate(-2),
            formatDate(-1),
        ],
        createdAt: formatDate(-30),
    },
    {
        _id: '3',
        userId: 'user1',
        name: 'Meditate',
        icon: 'brain',
        frequency: 'daily',
        streakCount: 5,
        completedDates: [
            formatDate(-6),
            formatDate(-5),
            formatDate(-3),
            formatDate(-2),
            formatDate(-1),
        ],
        createdAt: formatDate(-30),
    },
];

// Mock Mood Entries (last 7 days)
export const mockMoods: MoodEntry[] = [
    { _id: '1', userId: 'user1', mood: 3, date: formatDate(-6), createdAt: formatDate(-6) },
    { _id: '2', userId: 'user1', mood: 4, date: formatDate(-5), createdAt: formatDate(-5) },
    { _id: '3', userId: 'user1', mood: 4, date: formatDate(-4), createdAt: formatDate(-4) },
    { _id: '4', userId: 'user1', mood: 5, date: formatDate(-3), createdAt: formatDate(-3) },
    { _id: '5', userId: 'user1', mood: 4, date: formatDate(-2), createdAt: formatDate(-2) },
    { _id: '6', userId: 'user1', mood: 4, date: formatDate(-1), createdAt: formatDate(-1) },
    { _id: '7', userId: 'user1', mood: 5, date: today, createdAt: today },
];

// Weekly Summary (matching the 82 score from design)
export const mockWeeklySummary: WeeklySummary = {
    tasksCompleted: 12,
    totalTasks: 15,
    habitConsistency: 85,
    averageMood: 4.1,
    moodTrend: 'up',
};

// Weekly insight message
export const weeklyInsight = "You're off to a great start. Keep building momentum!";

// Calculate mood score (0-100)
export const calculateMoodScore = (moods: MoodEntry[]): number => {
    if (moods.length === 0) return 0;
    const avgMood = moods.reduce((sum, m) => sum + m.mood, 0) / moods.length;
    return Math.round((avgMood / 5) * 100);
};

// Get mood label based on score
export const getMoodLabel = (score: number): string => {
    if (score >= 80) return 'Great';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Okay';
    if (score >= 20) return 'Low';
    return 'Very Low';
};
