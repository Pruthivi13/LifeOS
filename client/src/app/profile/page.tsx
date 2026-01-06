'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Header, DashboardLayout } from '@/components/layout';
import { Card, Input, Button, Avatar } from '@/components/ui';
import { Save, ArrowLeft, LogOut, Check, Trash2, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';
import { predefinedAvatars, getAvatarsByCategory, type PredefinedAvatar } from '@/lib/avatars';

export default function ProfilePage() {
    const { user, token, checkAuth, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState<string>('');
    const [activeCategory, setActiveCategory] = useState<'male' | 'female' | 'neutral'>('male');
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email || '');
            setSelectedAvatar(user.avatar || '');
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            await api.put('/api/auth/profile', {
                name,
                email,
                avatar: selectedAvatar,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            await checkAuth();
            setMessage({ type: 'success', text: 'Profile updated successfully!' });

            // Redirect to homepage after a short delay
            setTimeout(() => {
                router.push('/');
            }, 1000);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setDeleteLoading(true);
        try {
            await api.delete('/api/auth/delete-account', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Clear all local storage and redirect
            localStorage.clear();
            window.location.href = '/login';
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to delete account' });
            setShowDeleteConfirm(false);
        } finally {
            setDeleteLoading(false);
        }
    };

    const categories = [
        { key: 'male' as const, label: '👨 Male' },
        { key: 'female' as const, label: '👩 Female' },
        { key: 'neutral' as const, label: '🤖 Fun' },
    ];

    return (
        <>
            <DashboardLayout
                header={
                    <Header
                        userName={user?.name}
                        userAvatar={selectedAvatar || user?.avatar}
                        isDarkMode={theme === 'dark'}
                        onToggleDarkMode={toggleTheme}
                    />
                }
            >
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            icon={<ArrowLeft className="w-4 h-4" />}
                        >
                            Back to Dashboard
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-soft-red hover:text-soft-red hover:bg-soft-red/10"
                            onClick={logout}
                            icon={<LogOut className="w-4 h-4" />}
                        >
                            Log Out
                        </Button>
                    </div>

                    <Card className="p-8">
                        <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

                        {message && (
                            <div className={`p-4 rounded-xl mb-6 text-sm ${message.type === 'success'
                                ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
                                : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Avatar Picker */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium mb-2">Choose Your Avatar</label>

                                {/* Current Selection */}
                                <div className="flex justify-center mb-4">
                                    <Avatar
                                        src={selectedAvatar}
                                        name={name}
                                        size="xl"
                                    />
                                </div>

                                {/* Category Tabs */}
                                <div className="flex gap-2 justify-center mb-4">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.key}
                                            type="button"
                                            onClick={() => setActiveCategory(cat.key)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.key
                                                ? 'bg-primary text-white'
                                                : 'bg-foreground/5 hover:bg-foreground/10'
                                                }`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Avatar Grid */}
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                    {getAvatarsByCategory(activeCategory).map((avatar) => (
                                        <button
                                            key={avatar.id}
                                            type="button"
                                            onClick={() => setSelectedAvatar(avatar.url)}
                                            className={`relative p-2 rounded-xl transition-all ${selectedAvatar === avatar.url
                                                ? 'bg-primary/20 ring-2 ring-primary'
                                                : 'bg-foreground/5 hover:bg-foreground/10'
                                                }`}
                                        >
                                            <img
                                                src={avatar.url}
                                                alt={avatar.name}
                                                className="w-full aspect-square rounded-lg"
                                            />
                                            {selectedAvatar === avatar.url && (
                                                <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-0.5">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 ml-1">Full Name</label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5 ml-1">Email Address</label>
                                    <Input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        type="email"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    icon={<Save className="w-4 h-4" />}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="p-8 border-red-500/20">
                        <h2 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Danger Zone
                        </h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            Permanently delete your account and all associated data. This action cannot be undone.
                        </p>

                        {!showDeleteConfirm ? (
                            <Button
                                variant="outline"
                                className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                                onClick={() => setShowDeleteConfirm(true)}
                                icon={<Trash2 className="w-4 h-4" />}
                            >
                                Delete My Account
                            </Button>
                        ) : (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl space-y-4">
                                <p className="text-sm font-medium text-red-500">
                                    Are you absolutely sure? This will permanently delete:
                                </p>
                                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                                    <li>Your profile and settings</li>
                                    <li>All your tasks</li>
                                    <li>All your habits and streaks</li>
                                    <li>All your mood history</li>
                                </ul>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowDeleteConfirm(false)}
                                        disabled={deleteLoading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="bg-red-500 hover:bg-red-600 text-white"
                                        onClick={handleDeleteAccount}
                                        disabled={deleteLoading}
                                        icon={<Trash2 className="w-4 h-4" />}
                                    >
                                        {deleteLoading ? 'Deleting...' : 'Yes, Delete Everything'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </DashboardLayout>
        </>
    );
}
