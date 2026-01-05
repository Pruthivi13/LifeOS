// LifeOS Type Definitions

// Priority levels for tasks
export type Priority = 'low' | 'medium' | 'high';

// Category types for tasks
export type Category = 'academic' | 'personal' | 'health' | 'work';

// Frequency for habits
export type Frequency = 'daily' | 'weekly';

// Mood levels (1-5 scale)
export type MoodLevel = 1 | 2 | 3 | 4 | 5;

// User interface
export interface User {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  preferences?: {
    routineType: 'student' | 'intern' | 'hybrid';
    priorities: string[];
  };
  createdAt: Date;
}

// Task interface
export interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  priority: Priority;
  category: Category;
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
}

// Habit interface
export interface Habit {
  _id: string;
  userId: string;
  name: string;
  icon?: string;
  frequency: Frequency;
  streakCount: number;
  completedDates: Date[];
  createdAt: Date;
}

// Mood entry interface
export interface MoodEntry {
  _id: string;
  userId: string;
  mood: MoodLevel;
  note?: string;
  date: Date;
  createdAt: Date;
}

// Analytics interfaces
export interface WeeklySummary {
  tasksCompleted: number;
  totalTasks: number;
  habitConsistency: number;
  averageMood: number;
  moodTrend: 'up' | 'down' | 'stable';
}

export interface MonthlyInsight {
  mostProductiveDay: string;
  moodHabitCorrelation: string;
  topCompletedCategory: Category;
  overallScore: number;
}

// Emoji mood mapping
export const moodEmojis: Record<MoodLevel, string> = {
  1: '😣',
  2: '😔',
  3: '😐',
  4: '🙂',
  5: '😄',
};

// Priority colors
export const priorityColors: Record<Priority, string> = {
  low: '#8FBC8B',    // Sage green
  medium: '#E6B17E', // Warm amber
  high: '#E88B8B',   // Soft red
};

// Category icons (lucide-react icon names)
export const categoryIcons: Record<Category, string> = {
  academic: 'book-open',
  personal: 'user',
  health: 'heart',
  work: 'briefcase',
};
