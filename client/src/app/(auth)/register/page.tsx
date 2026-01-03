'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, OTPInput, ResendTimer, LoadingSpinner } from '@/components/ui';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, ArrowLeft, Mail } from 'lucide-react';

type Step = 'info' | 'otp';

export default function RegisterPage() {
    const [step, setStep] = useState<Step>('info');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpError, setOtpError] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/api/auth/send-register-otp', { name, email });
            setStep('otp');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send code');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = useCallback(async (otp: string) => {
        setError('');
        setOtpError(false);
        setLoading(true);

        try {
            const res = await api.post('/api/auth/verify-register-otp', { email, otp });
            login(res.data, res.data.token);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid code');
            setOtpError(true);
        } finally {
            setLoading(false);
        }
    }, [email, login, router]);

    const handleResendOTP = async () => {
        setError('');
        try {
            await api.post('/api/auth/send-register-otp', { name, email });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to resend code');
        }
    };

    const handleBack = () => {
        setStep('info');
        setError('');
        setOtpError(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-sage/20 blur-[100px]" />
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-amber/20 blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <Image
                            src="/logo.png"
                            alt="LifeOS Logo"
                            width={48}
                            height={48}
                            className="rounded-full"
                        />
                        <h1 className="text-4xl font-bold tracking-tight">Join LifeOS</h1>
                    </div>
                    <p className="text-muted-foreground">Start organizing your digital life today.</p>
                </div>

                <div className="glass-card rounded-2xl p-8 border border-white/20 shadow-xl backdrop-blur-md">
                    <AnimatePresence mode="wait">
                        {step === 'info' ? (
                            <motion.form
                                key="info-step"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleSendOTP}
                                className="space-y-6"
                            >
                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <UserPlus className="w-8 h-8 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-semibold">Create your account</h2>
                                    <p className="text-sm text-muted-foreground mt-1">No password needed - just verify your email</p>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 ml-1">Full Name</label>
                                        <Input
                                            type="text"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="w-full"
                                        />
                                    </div>

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
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    disabled={loading || !name || !email}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <LoadingSpinner size="sm" />
                                            Sending Code...
                                        </span>
                                    ) : (
                                        'Continue'
                                    )}
                                </Button>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="otp-step"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <button
                                    onClick={handleBack}
                                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back
                                </button>

                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <Mail className="w-8 h-8 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-semibold">Verify your email</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        We sent a code to <span className="font-medium text-foreground">{email}</span>
                                    </p>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                <OTPInput
                                    onComplete={handleVerifyOTP}
                                    disabled={loading}
                                    error={otpError}
                                />

                                {loading && (
                                    <div className="flex justify-center">
                                        <LoadingSpinner size="md" className="text-primary" />
                                    </div>
                                )}

                                <ResendTimer seconds={60} onResend={handleResendOTP} disabled={loading} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Sign in
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
