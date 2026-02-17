import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MobileNavProps {
    userRole: 'owner' | 'agent' | 'admin';
}

export const MobileNav: React.FC<MobileNavProps> = ({ userRole }) => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const ownerLinks = [
        { path: '/dashboard', label: 'Home', icon: '🏠' },
        { path: '/claims/new', label: 'New', icon: '➕' },
        { path: '/claims/history', label: 'Claims', icon: '📋' },
        { path: '/profile', label: 'Profile', icon: '👤' },
    ];

    const agentLinks = [
        { path: '/dashboard', label: 'Home', icon: '🏠' },
        { path: '/claims/queue', label: 'Queue', icon: '📥' },
        { path: '/claims/history', label: 'History', icon: '📋' },
        { path: '/profile', label: 'Profile', icon: '👤' },
    ];

    const links = userRole === 'owner' ? ownerLinks : agentLinks;

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
            <div className="grid grid-cols-4 gap-1 px-2 py-2">
                {links.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`
              flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200
              ${isActive(link.path)
                                ? 'text-primary-600 bg-primary-50'
                                : 'text-gray-600 hover:bg-gray-100'
                            }
            `}
                    >
                        <span className="text-2xl mb-1">{link.icon}</span>
                        <span className="text-xs font-medium">{link.label}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
};
