'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, OTPInput, ResendTimer, LoadingSpinner, PhoneInput } from '@/components/ui';
import api from '@/lib/api';
import { setupRecaptcha, sendPhoneOTP, getFirebaseIdToken } from '@/lib/firebaseConfig';
import { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, ArrowLeft, CheckCircle } from 'lucide-react';

type AuthMethod = 'email' | 'phone';
type Step = 'input' | 'otp';

export default function LoginPage() {
    const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
    const [step, setStep] = useState<Step>('input');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpError, setOtpError] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    // Firebase phone auth
    const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
    const confirmationResultRef = useRef<ConfirmationResult | null>(null);

    // Setup reCAPTCHA when phone auth is selected (with delay to ensure Firebase is ready)
    useEffect(() => {
        if (authMethod === 'phone' && !recaptchaVerifierRef.current) {
            // Add a small delay to ensure Firebase is fully initialized
            const timer = setTimeout(() => {
                recaptchaVerifierRef.current = setupRecaptcha('recaptcha-container');
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [authMethod]);

    const handleSendEmailOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/api/auth/send-login-otp', { email });
            setStep('otp');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send code');
        } finally {
            setLoading(false);
        }
    };

    const handleSendPhoneOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!recaptchaVerifierRef.current) {
                recaptchaVerifierRef.current = setupRecaptcha('recaptcha-container');
            }
            if (!recaptchaVerifierRef.current) {
                throw new Error('reCAPTCHA not initialized');
            }

            const result = await sendPhoneOTP(phone, recaptchaVerifierRef.current);
            if (result) {
                confirmationResultRef.current = result;
                setStep('otp');
            } else {
                throw new Error('Failed to send OTP');
            }
        } catch (err: any) {
            console.error('Phone OTP error:', err);
            setError(err.message || 'Failed to send code. Please try again.');
            // Reset reCAPTCHA on error
            recaptchaVerifierRef.current = null;
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmailOTP = useCallback(async (otp: string) => {
        if (loading) return;

        setError('');
        setOtpError(false);
        setLoading(true);

        try {
            const res = await api.post('/api/auth/verify-login-otp', { email, otp });
            login(res.data, res.data.token);
            router.push('/');
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Invalid code');
            setOtpError(true);
            setLoading(false);
        }
    }, [email, login, router, loading]);

    const handleVerifyPhoneOTP = useCallback(async (otp: string) => {
        if (loading || !confirmationResultRef.current) return;

        setError('');
        setOtpError(false);
        setLoading(true);

        try {
            // Verify with Firebase
            await confirmationResultRef.current.confirm(otp);

            // Get Firebase ID token
            const idToken = await getFirebaseIdToken();
            if (!idToken) {
                throw new Error('Could not get Firebase token');
            }

            // Send to our backend
            const res = await api.post('/api/auth/phone-login', { idToken });
            login(res.data, res.data.token);
            router.push('/');
        } catch (err: any) {
            console.error('Phone verification error:', err);
            if (err.response?.data?.needsRegistration) {
                setError('No account found. Please register first.');
            } else {
                setError(err.response?.data?.message || err.message || 'Invalid code');
            }
            setOtpError(true);
            setLoading(false);
        }
    }, [login, router, loading]);

    const handleResendOTP = async () => {
        setError('');
        if (authMethod === 'email') {
            try {
                await api.post('/api/auth/send-login-otp', { email });
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to resend code');
            }
        } else {
            // For phone, we need to reset and resend
            recaptchaVerifierRef.current = null;
            setStep('input');
        }
    };

    const handleBack = () => {
        setStep('input');
        setError('');
        setOtpError(false);
    };

    const switchAuthMethod = (method: AuthMethod) => {
        setAuthMethod(method);
        setError('');
        setStep('input');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Hidden reCAPTCHA container */}
            <div id="recaptcha-container"></div>

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
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <Image
                            src="/logo.png"
                            alt="LifeOS Logo"
                            width={48}
                            height={48}
                            className="rounded-full"
                        />
                        <h1 className="text-4xl font-bold tracking-tight">LifeOS</h1>
                    </div>
                    <p className="text-muted-foreground">Welcome back to your calm space.</p>
                </div>

                <div className="glass-card rounded-2xl p-8 border border-white/20 shadow-xl backdrop-blur-md">
                    <AnimatePresence mode="wait">
                        {step === 'input' ? (
                            <motion.div
                                key="input-step"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                {/* Auth Method Toggle */}
                                <div className="flex gap-2 p-1 bg-muted rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() => switchAuthMethod('email')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all ${authMethod === 'email'
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        <Mail className="w-4 h-4" />
                                        <span className="text-sm font-medium">Email</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => switchAuthMethod('phone')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all ${authMethod === 'phone'
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        <Phone className="w-4 h-4" />
                                        <span className="text-sm font-medium">Phone</span>
                                    </button>
                                </div>

                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        {authMethod === 'email' ? (
                                            <Mail className="w-8 h-8 text-primary" />
                                        ) : (
                                            <Phone className="w-8 h-8 text-primary" />
                                        )}
                                    </div>
                                    <h2 className="text-xl font-semibold">
                                        Sign in with {authMethod === 'email' ? 'Email' : 'Phone'}
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        We'll send you a verification code
                                    </p>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={authMethod === 'email' ? handleSendEmailOTP : handleSendPhoneOTP}>
                                    <div className="space-y-4">
                                        {authMethod === 'email' ? (
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
                                        ) : (
                                            <div>
                                                <label className="block text-sm font-medium mb-1.5 ml-1">Phone Number</label>
                                                <PhoneInput
                                                    value={phone}
                                                    onChange={setPhone}
                                                    disabled={loading}
                                                />
                                            </div>
                                        )}

                                        <Button
                                            type="submit"
                                            className="w-full"
                                            size="lg"
                                            disabled={loading || (authMethod === 'email' ? !email : phone.length < 10)}
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
                                    </div>
                                </form>
                            </motion.div>
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
                                        <CheckCircle className="w-8 h-8 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-semibold">
                                        {authMethod === 'email' ? 'Check your email' : 'Check your phone'}
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        We sent a code to{' '}
                                        <span className="font-medium text-foreground">
                                            {authMethod === 'email' ? email : phone}
                                        </span>
                                    </p>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                <OTPInput
                                    onComplete={authMethod === 'email' ? handleVerifyEmailOTP : handleVerifyPhoneOTP}
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
                        Don't have an account?{' '}
                        <Link href="/register" className="text-primary hover:underline font-medium">
                            Create one
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
