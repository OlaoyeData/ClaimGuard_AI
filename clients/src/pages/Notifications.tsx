import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { fetchNotifications, mockNotifications } from '@/data/mockData';
import { formatRelativeTime } from '@/utils/formatters';
import type { Notification as NotificationType } from '@/types';

export const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNotifications = async () => {
            const data = await fetchNotifications();
            setNotifications(data);
            setLoading(false);
        };
        loadNotifications();
    }, []);

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const getNotificationIcon = (type: string) => {
        const icons: Record<string, string> = {
            claim_submitted: '📝',
            claim_approved: '✅',
            claim_rejected: '🚫',
            info_requested: '❓',
            claim_updated: '🔄',
        };
        return icons[type] || '📢';
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    if (loading) {
        return (
            <AppLayout notificationCount={unreadCount}>
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout notificationCount={unreadCount}>
            <div className="max-w-3xl mx-auto animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
                        <p className="text-gray-600">
                            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <EmptyState
                        icon={<div className="text-6xl">🔔</div>}
                        title="No notifications yet"
                        description="When you have updates on your claims, they'll appear here"
                        actionLabel="Go to Dashboard"
                        onAction={() => window.location.href = '/dashboard'}
                    />
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notification) => (
                            <Card
                                key={notification.id}
                                className={`cursor-pointer transition-all ${!notification.read ? 'border-l-4 border-l-primary-500 bg-primary-50/30' : ''
                                    }`}
                                onClick={() => markAsRead(notification.id)}
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="text-3xl flex-shrink-0">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-1">
                                            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                                            {!notification.read && (
                                                <span className="w-2 h-2 bg-primary-600 rounded-full ml-2 mt-1.5"></span>
                                            )}
                                        </div>
                                        <p className="text-gray-700 mb-2">{notification.message}</p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <span>{formatRelativeTime(notification.timestamp)}</span>
                                            {notification.claimId && (
                                                <Link
                                                    to={`/claims/${notification.claimId}`}
                                                    className="text-primary-600 hover:text-primary-700 font-medium"
                                                >
                                                    View Claim →
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
};
