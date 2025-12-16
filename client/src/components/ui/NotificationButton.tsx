'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import api from '@/lib/api';

export function NotificationButton() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if push notifications are supported
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true);
            checkSubscription();
        }
    }, []);

    const checkSubscription = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            setIsSubscribed(!!subscription);
        } catch (error) {
            console.error('Error checking subscription:', error);
        }
    };

    const subscribe = async () => {
        setLoading(true);
        try {
            // Register service worker
            const registration = await navigator.serviceWorker.register('/sw.js');
            await navigator.serviceWorker.ready;

            // Get VAPID public key from server
            const { data } = await api.get('/api/notifications/vapid-public-key');

            // Convert base64 to Uint8Array
            const urlBase64ToUint8Array = (base64String: string) => {
                const padding = '='.repeat((4 - base64String.length % 4) % 4);
                const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
                const rawData = window.atob(base64);
                const outputArray = new Uint8Array(rawData.length);
                for (let i = 0; i < rawData.length; ++i) {
                    outputArray[i] = rawData.charCodeAt(i);
                }
                return outputArray;
            };

            // Subscribe to push notifications
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(data.publicKey),
            });

            // Send subscription to server
            const token = localStorage.getItem('lifeos-token');
            await api.post(
                '/api/notifications/subscribe',
                subscription.toJSON(),
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setIsSubscribed(true);
        } catch (error) {
            console.error('Error subscribing:', error);
        } finally {
            setLoading(false);
        }
    };

    const unsubscribe = async () => {
        setLoading(true);
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                await subscription.unsubscribe();

                const token = localStorage.getItem('lifeos-token');
                await api.post(
                    '/api/notifications/unsubscribe',
                    { endpoint: subscription.endpoint },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            setIsSubscribed(false);
        } catch (error) {
            console.error('Error unsubscribing:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={isSupported ? (isSubscribed ? unsubscribe : subscribe) : undefined}
            disabled={loading || !isSupported}
            className={`p-2 rounded-lg transition-all duration-200 ${isSubscribed
                ? 'bg-primary/20 text-primary hover:bg-primary/30'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                } ${(loading || !isSupported) ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={!isSupported ? 'Notifications not supported' : (isSubscribed ? 'Disable notifications' : 'Enable notifications')}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isSubscribed ? (
                <Bell className="w-5 h-5" />
            ) : (
                <BellOff className="w-5 h-5" />
            )}
        </button>
    );
}
