import { initializeApp, getApps } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (only if not already initialized)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

// Helper to setup invisible reCAPTCHA
export const setupRecaptcha = (buttonId: string): RecaptchaVerifier | null => {
    if (typeof window === 'undefined') return null;

    try {
        const recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
            size: 'invisible',
            callback: () => {
                console.log('reCAPTCHA solved');
            },
            'expired-callback': () => {
                console.log('reCAPTCHA expired');
            }
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
    try {
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
        return confirmationResult;
    } catch (error) {
        console.error('Error sending phone OTP:', error);
        throw error;
    }
};

// Get ID token from current user
export const getFirebaseIdToken = async (): Promise<string | null> => {
    const user = auth.currentUser;
    if (!user) return null;

    try {
        const idToken = await user.getIdToken();
        return idToken;
    } catch (error) {
        console.error('Error getting ID token:', error);
        return null;
    }
};

export { auth };
export type { RecaptchaVerifier, ConfirmationResult };
