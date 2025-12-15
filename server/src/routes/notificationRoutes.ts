import express from 'express';
import { Request, Response } from 'express';
import { protect } from '../middleware/auth';
import PushSubscription from '../models/PushSubscription';
import { sendPushNotification, getVapidPublicKey } from '../utils/pushService';

const router = express.Router();

// @desc    Get VAPID public key
// @route   GET /api/notifications/vapid-public-key
// @access  Public
router.get('/vapid-public-key', (req: Request, res: Response) => {
    res.json({ publicKey: getVapidPublicKey() });
});

// @desc    Subscribe to push notifications
// @route   POST /api/notifications/subscribe
// @access  Private
router.post('/subscribe', protect, async (req: any, res: Response) => {
    try {
        const { endpoint, keys } = req.body;

        if (!endpoint || !keys?.p256dh || !keys?.auth) {
            res.status(400).json({ message: 'Invalid subscription data' });
            return;
        }

        // Check if subscription already exists
        const existing = await PushSubscription.findOne({ endpoint });

        if (existing) {
            // Update existing subscription
            existing.userId = req.user.id;
            existing.keys = keys;
            await existing.save();
            res.json({ success: true, message: 'Subscription updated' });
            return;
        }

        // Create new subscription
        await PushSubscription.create({
            userId: req.user.id,
            endpoint,
            keys,
        });

        res.json({ success: true, message: 'Subscribed to push notifications' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Unsubscribe from push notifications
// @route   POST /api/notifications/unsubscribe
// @access  Private
router.post('/unsubscribe', protect, async (req: any, res: Response) => {
    try {
        const { endpoint } = req.body;

        await PushSubscription.findOneAndDelete({ endpoint, userId: req.user.id });

        res.json({ success: true, message: 'Unsubscribed from push notifications' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Send a test notification
// @route   POST /api/notifications/test
// @access  Private
router.post('/test', protect, async (req: any, res: Response) => {
    try {
        const subscriptions = await PushSubscription.find({ userId: req.user.id });

        if (subscriptions.length === 0) {
            res.status(400).json({ message: 'No subscriptions found' });
            return;
        }

        const payload = {
            title: 'LifeOS Notification',
            body: 'Push notifications are working! 🎉',
            icon: '/logo.png',
            badge: '/logo.png',
            data: { url: '/' },
        };

        for (const sub of subscriptions) {
            try {
                await sendPushNotification(
                    { endpoint: sub.endpoint, keys: sub.keys },
                    payload
                );
            } catch (error) {
                // Remove invalid subscription
                await PushSubscription.findByIdAndDelete(sub._id);
            }
        }

        res.json({ success: true, message: 'Test notification sent' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
