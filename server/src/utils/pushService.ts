import webPush from 'web-push';

// Configure VAPID keys only if they are set
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_EMAIL = process.env.VAPID_EMAIL || 'mailto:admin@lifeos.app';

let isConfigured = false;

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    try {
        webPush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
        isConfigured = true;
        console.log('Push notifications configured successfully');
    } catch (error) {
        console.error('Failed to configure push notifications:', error);
    }
} else {
    console.log('Push notifications disabled: VAPID keys not configured');
}

interface PushSubscription {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

interface NotificationPayload {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    data?: Record<string, any>;
}

export const sendPushNotification = async (
    subscription: PushSubscription,
    payload: NotificationPayload
): Promise<void> => {
    if (!isConfigured) {
        console.log('Push notifications not configured, skipping...');
        return;
    }

    try {
        await webPush.sendNotification(
            subscription,
            JSON.stringify(payload)
        );
    } catch (error: any) {
        console.error('Error sending push notification:', error);
        throw error;
    }
};

export const getVapidPublicKey = (): string => {
    return process.env.VAPID_PUBLIC_KEY || '';
};

export const isPushConfigured = (): boolean => {
    return isConfigured;
};
