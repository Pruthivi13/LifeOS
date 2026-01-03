'use client';

import { useEffect, useCallback, useRef } from 'react';

export interface NotificationReminderOptions {
    hydrationEnabled?: boolean;
    tasksEnabled?: boolean;
    hydrationIntervalMinutes?: number;
    pendingTasksCount?: number;
}

export function useNotificationReminders({
    hydrationEnabled = true,
    tasksEnabled = true,
    hydrationIntervalMinutes = 120, // Every 2 hours
    pendingTasksCount = 0,
}: NotificationReminderOptions) {
    const hydrationIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const hasNotifiedTasksRef = useRef(false);

    // Request notification permission
    const requestPermission = useCallback(async () => {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    }, []);

    // Show a notification
    const showNotification = useCallback((title: string, options?: NotificationOptions) => {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-72x72.png',
                ...options,
            });
        }
    }, []);

    // Hydration reminder
    useEffect(() => {
        if (!hydrationEnabled) {
            if (hydrationIntervalRef.current) {
                clearInterval(hydrationIntervalRef.current);
                hydrationIntervalRef.current = null;
            }
            return;
        }

        const setupHydrationReminder = async () => {
            const hasPermission = await requestPermission();
            if (!hasPermission) return;

            // Clear existing interval
            if (hydrationIntervalRef.current) {
                clearInterval(hydrationIntervalRef.current);
            }

            // Set up new interval
            hydrationIntervalRef.current = setInterval(() => {
                // Get random hydration message for variety
                const messages = [
                    { title: '💧 Time for Water!', body: 'Stay refreshed! A glass of water boosts your energy and focus.' },
                    { title: '💧 Hydration Check', body: 'Your body needs water to function at its best. Take a sip!' },
                    { title: '💧 Water Break!', body: 'Pause and hydrate. Your future self will thank you!' },
                    { title: '💧 Drink Up!', body: 'Staying hydrated helps you stay productive. Grab that water!' },
                    { title: '💧 H2O Time', body: 'Regular hydration = better concentration. Time for a refill!' },
                    { title: '💧 Refresh Yourself', body: 'A quick water break can help reset your focus. Stay hydrated!' }
                ];
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];

                showNotification(randomMessage.title, {
                    body: randomMessage.body,
                    tag: 'hydration-reminder',
                } as NotificationOptions);
            }, hydrationIntervalMinutes * 60 * 1000);
        };

        setupHydrationReminder();

        return () => {
            if (hydrationIntervalRef.current) {
                clearInterval(hydrationIntervalRef.current);
            }
        };
    }, [hydrationEnabled, hydrationIntervalMinutes, requestPermission, showNotification]);

    // Pending tasks reminder (once per session when there are pending high-priority tasks)
    useEffect(() => {
        if (!tasksEnabled || hasNotifiedTasksRef.current) return;

        const checkPendingTasks = async () => {
            if (pendingTasksCount > 0) {
                const hasPermission = await requestPermission();
                if (!hasPermission) return;

                // Wait 10 seconds after page load before showing
                setTimeout(() => {
                    if (pendingTasksCount > 0) {
                        showNotification('📝 Pending Tasks', {
                            body: `You have ${pendingTasksCount} pending task${pendingTasksCount > 1 ? 's' : ''} to complete today. Let's get things done!`,
                            tag: 'pending-tasks',
                        });
                        hasNotifiedTasksRef.current = true;
                    }
                }, 10000);
            }
        };

        checkPendingTasks();
    }, [tasksEnabled, pendingTasksCount, requestPermission, showNotification]);

    return {
        requestPermission,
        showNotification,
    };
}
