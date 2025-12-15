import webPush from 'web-push';

// Configure VAPID keys
webPush.setVapidDetails(
    process.env.VAPID_EMAIL || 'mailto:admin@lifeos.app',
    process.env.VAPID_PUBLIC_KEY || '',
    process.env.VAPID_PRIVATE_KEY || ''
);

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
