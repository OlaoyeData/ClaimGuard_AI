import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
    userRole: 'owner' | 'agent' | 'admin';
}

export const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const ownerLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/claims/new', label: 'New Claim', icon: '➕' },
        { path: '/claims/history', label: 'My Claims', icon: '📋' },
        { path: '/notifications', label: 'Notifications', icon: '🔔' },
        { path: '/profile', label: 'Profile', icon: '👤' },
    ];

    const agentLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/claims/queue', label: 'Claims Queue', icon: '📥' },
        { path: '/claims/history', label: 'Claim History', icon: '📋' },
        { path: '/notifications', label: 'Notifications', icon: '🔔' },
        { path: '/profile', label: 'Profile', icon: '👤' },
    ];

    const links = userRole === 'owner' ? ownerLinks : agentLinks;

    return (
        <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
            {/* Logo */}
            <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                        🛡️
                    </div>
                    <div>
                        <h1 className="text-xl font-bold gradient-text">ClaimGuard AI</h1>
                        <p className="text-xs text-gray-500">Insurance Platform</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                {links.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`
              flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
              ${isActive(link.path)
                                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100'
                            }
            `}
                    >
                        <span className="text-xl">{link.icon}</span>
                        <span className="font-medium">{link.label}</span>
                    </Link>
                ))}
            </nav>

            {/* User info */}
            <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                        SM
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">Sarah Miller</p>
                        <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};
