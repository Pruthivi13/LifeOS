'use client';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, Auth } from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Lazy initialize Firebase only on client side
let app: FirebaseApp | null = null;
let auth: Auth | null = null;

const getFirebaseApp = (): FirebaseApp | null => {
    if (typeof window === 'undefined') return null; // SSR guard

    if (!app) {
        if (!firebaseConfig.apiKey) {
            console.warn('Firebase API key not configured');
            return null;
        }
        app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    }
    return app;
};

const getFirebaseAuth = (): Auth | null => {
    if (typeof window === 'undefined') return null; // SSR guard

    if (!auth) {
        const firebaseApp = getFirebaseApp();
        if (firebaseApp) {
            auth = getAuth(firebaseApp);
        }
    }
    return auth;
};

// Helper to setup reCAPTCHA (normal size for better reliability)
export const setupRecaptcha = (buttonId: string): RecaptchaVerifier | null => {
    if (typeof window === 'undefined') return null;

    const authInstance = getFirebaseAuth();
    if (!authInstance) {
        console.error('Firebase Auth not available');
        return null;
    }

    // Clear any existing reCAPTCHA
    const container = document.getElementById(buttonId);
    if (container) {
        container.innerHTML = '';
    }

    try {
        const recaptchaVerifier = new RecaptchaVerifier(authInstance, buttonId, {
            size: 'normal',
            callback: () => {
                console.log('reCAPTCHA solved');
            },
            'expired-callback': () => {
                console.log('reCAPTCHA expired');
            }
        });
        // Render the reCAPTCHA
        recaptchaVerifier.render().catch((err) => {
            console.error('reCAPTCHA render error:', err);
        });
        return recaptchaVerifier;
    } catch (error) {
        console.error('Error setting up reCAPTCHA:', error);
        return null;
    }
};

// Send OTP to phone number
export const sendPhoneOTP = async (
    phoneNumber: string,
    recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult | null> => {
    const authInstance = getFirebaseAuth();
    if (!authInstance) {
        throw new Error('Firebase Auth not initialized');
    }

    try {
        const confirmationResult = await signInWithPhoneNumber(authInstance, phoneNumber, recaptchaVerifier);
        return confirmationResult;
    } catch (error) {
        console.error('Error sending phone OTP:', error);
        throw error;
    }
};

// Get ID token from current user
export const getFirebaseIdToken = async (): Promise<string | null> => {
    const authInstance = getFirebaseAuth();
    if (!authInstance) return null;

    const user = authInstance.currentUser;
    if (!user) return null;

    try {
        const idToken = await user.getIdToken();
        return idToken;
    } catch (error) {
        console.error('Error getting ID token:', error);
        return null;
    }
};

export { getFirebaseAuth as auth };
export type { RecaptchaVerifier, ConfirmationResult };
