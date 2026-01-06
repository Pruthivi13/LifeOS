'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, OTPInput, ResendTimer, LoadingSpinner, PhoneInput } from '@/components/ui';
import api from '@/lib/api';
import { setupRecaptcha, sendPhoneOTP, getFirebaseIdToken, signInWithGoogle } from '@/lib/firebaseConfig';
import { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, ArrowLeft, Mail, Phone } from 'lucide-react';

type AuthMethod = 'email' | 'phone';
type Step = 'info' | 'otp';

export default function RegisterPage() {
    const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
    const [step, setStep] = useState<Step>('info');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
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
            await api.post('/api/auth/send-register-otp', { name, email });
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
            const res = await api.post('/api/auth/verify-register-otp', { email, otp });
            login(res.data, res.data.token);
            router.push('/');
        } catch (err: any) {
            console.error('Registration error:', err);
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

            // Send to our backend with name for registration
            const res = await api.post('/api/auth/phone-register', { idToken, name });
            login(res.data, res.data.token);
            router.push('/');
        } catch (err: any) {
            console.error('Phone registration error:', err);
            setError(err.response?.data?.message || err.message || 'Invalid code');
            setOtpError(true);
            setLoading(false);
        }
    }, [name, login, router, loading]);

    const handleResendOTP = async () => {
        setError('');
        if (authMethod === 'email') {
            try {
                await api.post('/api/auth/send-register-otp', { name, email });
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to resend code');
            }
        } else {
            recaptchaVerifierRef.current = null;
            setStep('info');
        }
    };

    const handleBack = () => {
        setStep('info');
        setError('');
        setOtpError(false);
    };

    const switchAuthMethod = (method: AuthMethod) => {
        setAuthMethod(method);
        setError('');
        setStep('info');
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setGoogleLoading(true);

        try {
            const result = await signInWithGoogle();
            if (!result) {
                throw new Error('Google Sign-In failed');
            }

            // Send to our backend - same endpoint for login/register
            const res = await api.post('/api/auth/google-login', {
                idToken: result.idToken,
                name: result.name,
                photoURL: result.photoURL,
            });
            login(res.data, res.data.token);
            router.push('/');
        } catch (err: any) {
            console.error('Google Sign-In error:', err);
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Sign-in cancelled');
            } else {
                setError(err.message || 'Failed to sign in with Google');
            }
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Hidden reCAPTCHA container */}
            <div id="recaptcha-container"></div>

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
                            <motion.div
                                key="info-step"
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
                                        <UserPlus className="w-8 h-8 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-semibold">Create your account</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        No password needed - just verify your {authMethod}
                                    </p>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={authMethod === 'email' ? handleSendEmailOTP : handleSendPhoneOTP}>
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
                                            disabled={loading || !name || (authMethod === 'email' ? !email : phone.length < 10)}
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

                                {/* Divider */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-white/10" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-transparent px-2 text-muted-foreground">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                {/* Google Sign-In Button */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full flex items-center justify-center gap-3 py-6 border-white/20 hover:bg-white/5"
                                    onClick={handleGoogleSignIn}
                                    disabled={loading || googleLoading}
                                >
                                    {googleLoading ? (
                                        <LoadingSpinner size="sm" />
                                    ) : (
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path
                                                fill="currentColor"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                    )}
                                    <span>Continue with Google</span>
                                </Button>
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
                                        {authMethod === 'email' ? (
                                            <Mail className="w-8 h-8 text-primary" />
                                        ) : (
                                            <Phone className="w-8 h-8 text-primary" />
                                        )}
                                    </div>
                                    <h2 className="text-xl font-semibold">Verify your {authMethod}</h2>
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
