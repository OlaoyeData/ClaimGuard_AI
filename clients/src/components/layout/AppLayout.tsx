import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

interface AppLayoutProps {
    children: React.ReactNode;
    userRole?: 'owner' | 'agent' | 'admin';
    notificationCount?: number;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
    children,
    userRole = 'agent',
    notificationCount = 0,
}) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <Sidebar userRole={userRole} />

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 lg:hidden">
                        <Sidebar userRole={userRole} />
                    </div>
                </>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                <Header
                    onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    notificationCount={notificationCount}
                />

                <main className="flex-1 p-4 lg:p-8 pb-20 lg:pb-8">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileNav userRole={userRole} />
        </div>
    );
};
