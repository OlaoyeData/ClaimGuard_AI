import apiClient from './api';
import type { User, UserRole } from '../types';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupData {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export const authService = {
    /**
     * Login user with email and password
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login-json', credentials);

        // Store token and user in localStorage
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        return response.data;
    },

    /**
     * Register a new user
     */
    async signup(data: SignupData): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/signup', data);

        // Store token and user in localStorage
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        return response.data;
    },

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        try {
            await apiClient.post('/auth/logout');
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    /**
     * Get current user info
     */
    async getCurrentUser(): Promise<User> {
        const response = await apiClient.get<User>('/auth/me');
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    },

    /**
     * Get stored user from localStorage
     */
    getStoredUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    },
};
