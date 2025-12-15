'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Header, DashboardLayout } from '@/components/layout';
import { Card, Input, Button, Avatar } from '@/components/ui';
import { Camera, Save, ArrowLeft, LogOut } from 'lucide-react';
import api from '@/lib/api';

export default function ProfilePage() {
    const { user, token, checkAuth, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar || null);
        } else {
            // Redirect if not logged in
            // router.push('/login');
        }
    }, [user, router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        if (selectedFile) {
            formData.append('avatar', selectedFile);
        }

        try {
            const res = await api.put('/api/auth/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            // Refresh auth state
            await checkAuth();
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

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
                            {/* Avatar Upload */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative group">
                                    <Avatar
                                        src={avatarPreview || undefined}
                                        name={name}
                                        size="lg"
                                        className="w-32 h-32 md:w-32 md:h-32 text-4xl"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                                    >
                                        <Camera className="w-8 h-8" />
                                    </button>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Change Photo
                                </Button>
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
                </div>
            </DashboardLayout>
        </>
    );
}
