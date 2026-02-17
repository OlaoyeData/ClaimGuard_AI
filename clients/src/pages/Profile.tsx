import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { mockNotifications, currentUser } from '@/data/mockData';

export const Profile: React.FC = () => {
    const [notifications, setNotifications] = useState({
        emailClaims: true,
        emailUpdates: true,
        smsAlerts: false,
    });

    const handleLogout = () => {
        // In a real app, this would clear auth tokens
        window.location.href = '/login';
    };

    return (
        <AppLayout notificationCount={mockNotifications.filter(n => !n.read).length}>
            <div className="max-w-3xl mx-auto animate-fade-in">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile & Settings</h1>
                    <p className="text-gray-600">Manage your account settings and preferences</p>
                </div>

                {/* User Profile */}
                <Card className="mb-6">
                    <div className="flex items-center space-x-6 mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {currentUser.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900">{currentUser.name}</h2>
                            <p className="text-gray-600">{currentUser.email}</p>
                            <div className="mt-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700 capitalize">
                                    {currentUser.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Full Name"
                            value={currentUser.name}
                            disabled
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            value={currentUser.email}
                            disabled
                        />
                        <Input
                            label="Role"
                            value={currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                            disabled
                        />
                    </div>
                </Card>

                {/* Notification Preferences */}
                <Card className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                        <label className="flex items-center justify-between cursor-pointer">
                            <div>
                                <p className="font-medium text-gray-900">Email - Claim Updates</p>
                                <p className="text-sm text-gray-600">Receive emails when your claims are updated</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={notifications.emailClaims}
                                onChange={(e) => setNotifications({ ...notifications, emailClaims: e.target.checked })}
                                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                        </label>

                        <label className="flex items-center justify-between cursor-pointer">
                            <div>
                                <p className="font-medium text-gray-900">Email - Platform Updates</p>
                                <p className="text-sm text-gray-600">Get notified about new features and updates</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={notifications.emailUpdates}
                                onChange={(e) => setNotifications({ ...notifications, emailUpdates: e.target.checked })}
                                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                        </label>

                        <label className="flex items-center justify-between cursor-pointer">
                            <div>
                                <p className="font-medium text-gray-900">SMS Alerts</p>
                                <p className="text-sm text-gray-600">Receive text messages for urgent updates</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={notifications.smsAlerts}
                                onChange={(e) => setNotifications({ ...notifications, smsAlerts: e.target.checked })}
                                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                        </label>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <Button variant="primary">Save Preferences</Button>
                    </div>
                </Card>

                {/* Security */}
                <Card className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
                    <Button variant="secondary">Change Password</Button>
                </Card>

                {/* Logout */}
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Sign Out</h3>
                            <p className="text-sm text-gray-600">Sign out of your account on this device</p>
                        </div>
                        <Button variant="danger" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
};
