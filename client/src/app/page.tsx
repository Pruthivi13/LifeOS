'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
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
  EditHabitModal
} from '@/components/features';
import { useTheme, useAuth } from '@/context';
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
  const [activeModal, setActiveModal] = useState<'none' | 'task' | 'habit' | 'editHabit'>('none');
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

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
        axios.get('http://localhost:5000/api/tasks'),
        axios.get('http://localhost:5000/api/habits'),
        axios.get('http://localhost:5000/api/moods')
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
      await axios.put(`http://localhost:5000/api/habits/${id}`, updates);
      const res = await axios.get('http://localhost:5000/api/habits');
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
      await axios.delete(`http://localhost:5000/api/habits/${id}`);
      const res = await axios.get('http://localhost:5000/api/habits');
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
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, {
        completed: !task.completed
      });
    } catch (error) {
      console.error('Failed to toggle task', error);
      setTasks(tasks);
    }
  };

  const handleHabitComplete = async (habitId: string, date: Date) => {
    try {
      await axios.put(`http://localhost:5000/api/habits/${habitId}/complete`, {
        date: date.toISOString()
      });
      const res = await axios.get('http://localhost:5000/api/habits');
      setHabits(res.data);
    } catch (error) {
      console.error('Failed to complete habit', error);
    }
  };

  const handleMoodSelect = async (mood: number) => {
    try {
      await axios.post('http://localhost:5000/api/moods', {
        mood,
        note: '',
        date: new Date()
      });
      const res = await axios.get('http://localhost:5000/api/moods');
      setMoods(res.data);
    } catch (error) {
      console.error('Failed to log mood', error);
    }
  };

  const handleAddTask = async (taskData: any) => {
    try {
      setModalLoading(true);
      await axios.post('http://localhost:5000/api/tasks', taskData);
      const res = await axios.get('http://localhost:5000/api/tasks');
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
      await axios.post('http://localhost:5000/api/habits', habitData);
      const res = await axios.get('http://localhost:5000/api/habits');
      setHabits(res.data);
      setActiveModal('none');
    } catch (error) {
      console.error('Failed to add habit', error);
    } finally {
      setModalLoading(false);
    }
  };

  // Calculations
  const moodScore = moods.length > 0
    ? Math.round(moods.reduce((acc, m) => acc + m.mood, 0) / moods.length * 20)
    : 0;
  const moodLabel = getMoodLabel(moodScore);

  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const totalTasksCount = tasks.length;
  const habitStreak = habits.length > 0
    ? Math.round(habits.reduce((acc, h) => acc + h.streakCount, 0) / habits.length)
    : 0;

  // Dynamic Insight Logic
  let currentInsight = weeklyInsight;
  if (moodScore > 80) currentInsight = "You're radiating positivity! Keep it up.";
  else if (moodScore < 40 && moodScore > 0) currentInsight = "It's okay to have low days. Be kind to yourself.";
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
              habitStreak: habitStreak
            }}
          />

          <MoodCard
            score={moodScore}
            label={moodLabel}
            period="This week"
          />

          <HydrationCard />
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
    </>
  );
}
