'use client';

import { useRouter } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { Header, DashboardLayout } from '@/components/layout';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ArrowLeft, CheckCircle2, BarChart2, Smile, Zap, Droplets, Palette, Activity, Bell, Smartphone } from 'lucide-react';
import {
    TasksCard,
    HabitsCard,
    AnalyticsCard,
    MoodCard,
    MoodCheckIn,
    HydrationCard
} from '@/components/features';
import { mockTasks, mockHabits } from '@/lib/mockData';

export default function AboutPage() {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();

    const features = [
        {
            icon: <CheckCircle2 className="w-6 h-6 text-primary" />,
            title: "Task Management",
            desc: "Organize your day with a smart todo list. Set priorities, categories, and track completion in real-time."
        },
        {
            icon: <Zap className="w-6 h-6 text-warm-amber" />,
            title: "Habit Tracking",
            desc: "Build lasting habits with our streak system. Visualize your 7-day consistency with interactive tracking."
        },
        {
            icon: <Smile className="w-6 h-6 text-sage-green" />,
            title: "Mood Journaling",
            desc: "Track your emotional well-being daily. See how your mood correlates with productivity over time."
        },
        {
            icon: <Activity className="w-6 h-6 text-soft-blue" />,
            title: "Dynamic Wellness Score",
            desc: "Real-time score combining tasks (30%), hydration (20%), habits (20%), and mood (30%). Updates instantly!"
        },
        {
            icon: <Droplets className="w-6 h-6 text-cyan-400" />,
            title: "Hydration Tracker",
            desc: "Track your water intake with a goal of 8 glasses daily. Every glass boosts your wellness score."
        },
        {
            icon: <BarChart2 className="w-6 h-6 text-purple-400" />,
            title: "Smart Analytics",
            desc: "Beautiful animated cards showing tasks, streak, water, and mood. Dynamic motivational messages adapt to your progress."
        },
        {
            icon: <Smartphone className="w-6 h-6 text-pink-400" />,
            title: "PWA Support",
            desc: "Install LifeOS on your phone like a native app. Works offline and provides a seamless mobile experience."
        },
        {
            icon: <Palette className="w-6 h-6 text-amber-400" />,
            title: "Dark/Light Mode",
            desc: "Beautiful theming that adapts to your preference. Calm, distraction-free interface for focused productivity."
        }
    ];

    return (
        <>
            <DashboardLayout
                header={
                    <Header
                        userName={user?.name}
                        userAvatar={user?.avatar}
                        isDarkMode={theme === 'dark'}
                        onToggleDarkMode={toggleTheme}
                    />
                }
            >
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Back Button */}
                    <div className="flex justify-start">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            icon={<ArrowLeft className="w-4 h-4" />}
                        >
                            Back to Dashboard
                        </Button>
                    </div>

                    {/* Hero Section */}
                    <div className="text-center space-y-4 py-8">
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-dark to-soft-blue bg-300% animate-gradient">
                            About LifeOS
                        </h1>
                        <p className="text-xl text-foreground-muted max-w-2xl mx-auto text-balance">
                            Your personal dashboard for a balanced and productive life.
                            Manage tasks, build habits, and track your mood in one beautiful space.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <Card key={i} className="p-6 hover:translate-y-[-2px] transition-transform duration-300">
                                <div className="flex flex-col gap-4 h-full">
                                    <div className="p-3 w-fit rounded-xl bg-background-secondary/50">
                                        {feature.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                        <p className="text-foreground-muted leading-relaxed text-sm">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Mission Statement */}
                    <Card className="p-8 md:p-12 text-center bg-gradient-to-b from-transparent to-primary/5 border-primary/10">
                        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                        <p className="text-foreground-muted text-lg max-w-2xl mx-auto text-balance">
                            LifeOS was designed to bring clarity to chaos. We believe that productivity tools shouldn't be stressful—they should be calm, inviting, and encouraging. By combining tasks, habits, and mood tracking, we help you see the whole picture of your life.
                        </p>
                    </Card>

                    {/* Version Info */}
                    <div className="text-center text-sm text-foreground-muted pt-8 pb-4 space-y-2">
                        <p>Version 2.0.0 • Dec 2025</p>
                        <a href="/feedback" className="text-primary hover:underline">
                            Send Feedback →
                        </a>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
