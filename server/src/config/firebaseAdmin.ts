import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
const initializeFirebaseAdmin = () => {
    if (admin.apps.length > 0) {
        return admin.apps[0]!;
    }

    const privateKey = process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined;

    if (!process.env.FIREBASE_PROJECT_ID || !privateKey || !process.env.FIREBASE_CLIENT_EMAIL) {
        console.warn('⚠️ Firebase Admin SDK not configured - phone auth will not work');
        return null;
    }

    try {
        const app = admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: privateKey,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            }),
        });
        console.log('✅ Firebase Admin SDK initialized');
        return app;
    } catch (error) {
        console.error('❌ Failed to initialize Firebase Admin SDK:', error);
        return null;
    }
};

// Initialize on module load
initializeFirebaseAdmin();

// Verify Firebase ID token
export const verifyFirebaseToken = async (idToken: string): Promise<admin.auth.DecodedIdToken | null> => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        return decodedToken;
    } catch (error) {
        console.error('❌ Firebase token verification failed:', error);
        return null;
    }
};

// Get user's phone number from Firebase
export const getFirebaseUser = async (uid: string): Promise<admin.auth.UserRecord | null> => {
    try {
        const userRecord = await admin.auth().getUser(uid);
        return userRecord;
    } catch (error) {
        console.error('❌ Failed to get Firebase user:', error);
        return null;
    }
};

export default admin;
