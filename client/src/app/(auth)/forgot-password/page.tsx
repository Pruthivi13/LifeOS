'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import axios from 'axios';
import { motion } from 'framer-motion';

type Step = 'email' | 'otp' | 'success';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setStep('otp');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await axios.post('http://localhost:5000/api/auth/reset-password', {
                email,
                otp,
                password,
            });
            setStep('success');
            setTimeout(() => router.push('/login'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-lavender/20 blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">
                        {step === 'email' && 'Forgot Password'}
                        {step === 'otp' && 'Verify OTP'}
                        {step === 'success' && 'Success!'}
                    </h1>
                    <p className="text-muted-foreground">
                        {step === 'email' && 'Enter your email to receive an OTP.'}
                        {step === 'otp' && 'Check your email (including spam/junk folder) for the 6-digit code.'}
                        {step === 'success' && 'Your password has been reset.'}
                    </p>
                </div>

                <div className="glass-card rounded-2xl p-8 border border-white/20 shadow-xl backdrop-blur-md">
                    {error && (
                        <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {step === 'email' && (
                        <form onSubmit={handleEmailSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-1.5 ml-1">Email</label>
                                <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full"
                                />
                            </div>

                            <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                {loading ? 'Sending...' : 'Send OTP'}
                            </Button>
                        </form>
                    )}

                    {step === 'otp' && (
                        <form onSubmit={handleResetSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-1.5 ml-1">OTP Code</label>
                                <Input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    required
                                    className="w-full text-center text-2xl tracking-widest"
                                    maxLength={6}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 ml-1">New Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 ml-1">Confirm Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full"
                                />
                            </div>

                            <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>

                            <button
                                type="button"
                                onClick={() => setStep('email')}
                                className="w-full text-sm text-muted-foreground hover:text-primary"
                            >
                                ← Back to email
                            </button>
                        </form>
                    )}

                    {step === 'success' && (
                        <div className="text-center py-8">
                            <div className="text-5xl mb-4">✓</div>
                            <p className="text-green-500 font-medium">Password reset successful!</p>
                            <p className="text-sm text-muted-foreground mt-2">Redirecting to login...</p>
                        </div>
                    )}

                    {step !== 'success' && (
                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            Remember your password?{' '}
                            <Link href="/login" className="text-primary hover:underline font-medium">
                                Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
