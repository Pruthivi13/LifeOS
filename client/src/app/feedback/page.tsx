'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Header, DashboardLayout } from '@/components/layout';
import { Card, Input, Button } from '@/components/ui';
import { Send, ArrowLeft, MessageSquare, Mail, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function FeedbackPage() {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !subject || !message) {
            setStatus({ type: 'error', text: 'Please fill in all fields' });
            return;
        }

        setLoading(true);
        setStatus(null);

        try {
            await api.post('/api/feedback', {
                name,
                email,
                subject,
                message,
            });

            setStatus({ type: 'success', text: 'Thank you for your feedback! We\'ll get back to you soon.' });
            setSubject('');
            setMessage('');
        } catch (error: any) {
            setStatus({
                type: 'error',
                text: error.response?.data?.message || 'Failed to send feedback. Please try again.'
            });
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
                    <div className="flex items-center gap-4 mb-4">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            icon={<ArrowLeft className="w-4 h-4" />}
                        >
                            Back
                        </Button>
                    </div>

                    <Card className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-primary/10">
                                <MessageSquare className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Contact & Feedback</h2>
                                <p className="text-foreground-muted text-sm">We'd love to hear from you!</p>
                            </div>
                        </div>

                        {status && (
                            <div className={`p-4 rounded-xl mb-6 text-sm ${status.type === 'success'
                                    ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
                                    : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                                }`}>
                                {status.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 ml-1">
                                        <User className="w-4 h-4 inline mr-1" />
                                        Your Name
                                    </label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 ml-1">
                                        <Mail className="w-4 h-4 inline mr-1" />
                                        Your Email
                                    </label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 ml-1">Subject</label>
                                <Input
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Bug report, Feature request, General feedback..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 ml-1">Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Tell us what's on your mind..."
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                />
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    icon={<Send className="w-4 h-4" />}
                                    className="w-full sm:w-auto"
                                >
                                    {loading ? 'Sending...' : 'Send Feedback'}
                                </Button>
                            </div>
                        </form>
                    </Card>

                    <p className="text-center text-sm text-foreground-muted">
                        You can also reach us directly at{' '}
                        <a href="mailto:mail.to.pruthivi@gmail.com" className="text-primary hover:underline">
                            mail.to.pruthivi@gmail.com
                        </a>
                    </p>
                </div>
            </DashboardLayout>
        </>
    );
}
