'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Header, DashboardLayout, DashboardGrid } from '@/components/layout';
import {
  TasksCard,
  HabitsCard,
  MoodCard,
  MoodCheckIn,
  AnalyticsCard,
  HydrationCard,
  AddTaskModal,
  AddHabitModal,
  EditHabitModal,
  EditTaskModal
} from '@/components/features';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Task, Habit, MoodEntry } from '@/types';
import { getMoodLabel, weeklyInsight } from '@/lib/mockData';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [activeModal, setActiveModal] = useState<'none' | 'task' | 'habit' | 'editHabit' | 'editTask'>('none');
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [hydrationGlasses, setHydrationGlasses] = useState(0);

  // Auth Protection
  useEffect(() => {
    console.log('Dashboard mounted');
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch Data
  useEffect(() => {
    if (user && token) {
      fetchDashboardData();
    }
  }, [user, token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [tasksRes, habitsRes, moodsRes] = await Promise.all([
        api.get('/api/tasks'),
        api.get('/api/habits'),
        api.get('/api/moods')
      ]);

      setTasks(tasksRes.data);
      setHabits(habitsRes.data);
      setMoods(moodsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditHabit = async (id: string, updates: Partial<Habit>) => {
    try {
      setModalLoading(true);
      await api.put(`/api/habits/${id}`, updates);
      const res = await api.get('/api/habits');
      setHabits(res.data);
      setActiveModal('none');
      setSelectedHabit(null);
    } catch (error) {
      console.error('Failed to update habit', error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteHabit = async (id: string) => {
    try {
      setModalLoading(true);
      await api.delete(`/api/habits/${id}`);
      const res = await api.get('/api/habits');
      setHabits(res.data);
      setActiveModal('none');
      setSelectedHabit(null);
    } catch (error) {
      console.error('Failed to delete habit', error);
    } finally {
      setModalLoading(false);
    }
  };

  const openEditHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setActiveModal('editHabit');
  };

  const handleTaskToggle = async (taskId: string) => {
    const taskIndex = tasks.findIndex(t => t._id === taskId);
    if (taskIndex === -1) return;

    const newTasks = [...tasks];
    newTasks[taskIndex].completed = !newTasks[taskIndex].completed;
    setTasks(newTasks);

    try {
      const task = tasks[taskIndex];
      await api.put(`/api/tasks/${taskId}`, {
        completed: !task.completed
      });
    } catch (error) {
      console.error('Failed to toggle task', error);
      setTasks(tasks);
    }
  };

  const handleHabitComplete = async (habitId: string, date: Date) => {
    try {
      await api.put(`/api/habits/${habitId}/complete`, {
        date: date.toISOString()
      });
      const res = await api.get('/api/habits');
      setHabits(res.data);
    } catch (error) {
      console.error('Failed to complete habit', error);
    }
  };

  const handleMoodSelect = async (mood: number) => {
    try {
      await api.post('/api/moods', {
        mood,
        note: '',
        date: new Date()
      });
      const res = await api.get('/api/moods');
      setMoods(res.data);
    } catch (error) {
      console.error('Failed to log mood', error);
    }
  };

  const handleAddTask = async (taskData: any) => {
    try {
      setModalLoading(true);
      await api.post('/api/tasks', taskData);
      const res = await api.get('/api/tasks');
      setTasks(res.data);
      setActiveModal('none');
    } catch (error) {
      console.error('Failed to add task', error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddHabit = async (habitData: any) => {
    try {
      setModalLoading(true);
      await api.post('/api/habits', habitData);
      const res = await api.get('/api/habits');
      setHabits(res.data);
      setActiveModal('none');
    } catch (error) {
      console.error('Failed to add habit', error);
    } finally {
      setModalLoading(false);
    }
  };

  const openEditTask = (task: Task) => {
    setSelectedTask(task);
    setActiveModal('editTask');
  };

  const handleEditTask = async (id: string, updates: Partial<Task>) => {
    try {
      setModalLoading(true);
      await api.put(`/api/tasks/${id}`, updates);
      const res = await api.get('/api/tasks');
      setTasks(res.data);
      setActiveModal('none');
      setSelectedTask(null);
    } catch (error) {
      console.error('Failed to update task', error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setModalLoading(true);
      await api.delete(`/api/tasks/${id}`);
      const res = await api.get('/api/tasks');
      setTasks(res.data);
      setActiveModal('none');
      setSelectedTask(null);
    } catch (error) {
      console.error('Failed to delete task', error);
    } finally {
      setModalLoading(false);
    }
  };

  // Calculations
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const totalTasksCount = tasks.length;
  const habitStreak = habits.length > 0
    ? Math.round(habits.reduce((acc, h) => acc + h.streakCount, 0) / habits.length)
    : 0;

  // Get today's mood (latest mood entry for today)
  const todayMood = moods.length > 0
    ? moods.find(m => new Date(m.date).toDateString() === new Date().toDateString())?.mood || 0
    : 0;

  // Calculate individual scores (0-100 each)
  const taskScore = totalTasksCount > 0
    ? Math.round((completedTasksCount / totalTasksCount) * 100)
    : 50; // Default to 50 if no tasks
  const hydrationScore = Math.round((hydrationGlasses / 8) * 100);
  const habitScore = Math.min(habitStreak * 20, 100); // Max 100 at 5+ days streak
  const moodScoreRaw = todayMood > 0 ? todayMood * 20 : 50; // Convert 1-5 to 0-100, default 50

  // Composite Wellness Score (weighted average)
  // Tasks: 30%, Hydration: 20%, Habits: 20%, Mood: 30%
  const wellnessScore = Math.round(
    (taskScore * 0.30) +
    (hydrationScore * 0.20) +
    (habitScore * 0.20) +
    (moodScoreRaw * 0.30)
  );

  // Get label based on wellness score
  const getWellnessLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Okay';
    if (score >= 20) return 'Low';
    return 'Start Fresh';
  };
  const wellnessLabel = getWellnessLabel(wellnessScore);

  // Dynamic Insight Logic (now uses wellness score)
  let currentInsight = weeklyInsight;
  if (wellnessScore >= 80) currentInsight = "You're radiating positivity! Keep it up.";
  else if (wellnessScore < 40 && wellnessScore > 0) currentInsight = "It's okay to have low days. Be kind to yourself.";
  else if (completedTasksCount > 5) currentInsight = "You are crushing your tasks effortlessly.";
  else if (habitStreak > 3) currentInsight = "Your consistency is inspiring!";

  if (authLoading || (!user && loading)) {
    return <div className="min-h-screen flex items-center justify-center">Loading LifeOS...</div>;
  }

  return (
    <>
      <DashboardLayout
        header={
          <Header
            userName={user?.name || 'Guest'}
            userAvatar={user?.avatar}
            isDarkMode={theme === 'dark'}
            onToggleDarkMode={toggleTheme}
          />
        }
      >
        <DashboardGrid>
          {/* Row 1 */}
          <TasksCard
            tasks={tasks}
            onToggleTask={handleTaskToggle}
            onAddTask={() => setActiveModal('task')}
            onEditTask={openEditTask}
          />

          <HabitsCard
            habits={habits}
            onCompleteHabit={handleHabitComplete}
            onAddHabit={() => setActiveModal('habit')}
            onEditHabit={openEditHabit}
          />

          <div className="md:col-span-1">
            <MoodCheckIn
              onSelectMood={handleMoodSelect}
              weeklyInsight={currentInsight}
            />
          </div>

          {/* Row 2 */}
          <AnalyticsCard
            stats={{
              completedTasks: completedTasksCount,
              totalTasks: totalTasksCount,
              habitStreak: habitStreak,
              hydrationGlasses: hydrationGlasses,
              todayMood: todayMood
            }}
          />

          <MoodCard
            score={wellnessScore}
            label={wellnessLabel}
            period="Today"
            todayMood={todayMood}
          />

          <HydrationCard onHydrationChange={setHydrationGlasses} />
        </DashboardGrid>
      </DashboardLayout>

      <AddTaskModal
        isOpen={activeModal === 'task'}
        onClose={() => setActiveModal('none')}
        onAdd={handleAddTask}
        loading={modalLoading}
      />

      <AddHabitModal
        isOpen={activeModal === 'habit'}
        onClose={() => setActiveModal('none')}
        onAdd={handleAddHabit}
        loading={modalLoading}
      />

      <EditHabitModal
        isOpen={activeModal === 'editHabit'}
        onClose={() => { setActiveModal('none'); setSelectedHabit(null); }}
        onEdit={handleEditHabit}
        onDelete={handleDeleteHabit}
        habit={selectedHabit}
        loading={modalLoading}
      />

      <EditTaskModal
        isOpen={activeModal === 'editTask'}
        onClose={() => { setActiveModal('none'); setSelectedTask(null); }}
        onSave={handleEditTask}
        onDelete={handleDeleteTask}
        task={selectedTask}
        loading={modalLoading}
      />
    </>
  );
}
