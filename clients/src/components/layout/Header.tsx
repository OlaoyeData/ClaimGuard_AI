import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
    onMenuClick: () => void;
    notificationCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, notificationCount = 0 }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="px-4 py-3 flex items-center justify-between">
                {/* Mobile menu button */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Title (mobile) */}
                <div className="lg:hidden flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg flex items-center justify-center text-white font-bold">
                        🛡️
                    </div>
                    <span className="font-bold gradient-text">ClaimGuard AI</span>
                </div>

                {/* Search (desktop) */}
                <div className="hidden lg:flex flex-1 max-w-lg">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search claims..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <Link to="/notifications" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {notificationCount > 0 && (
                            <span className="absolute top-1 right-1 w-5 h-5 bg-danger-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {notificationCount}
                            </span>
                        )}
                    </Link>

                    {/* User menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                SM
                            </div>
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Profile Settings
                                </Link>
                                <button className="w-full text-left px-4 py-2 text-sm text-danger-600 hover:bg-gray-100">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
