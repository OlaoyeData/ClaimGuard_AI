import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { isValidEmail, isRequired } from '@/utils/validation';
import { authService } from '@/services/authService';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const newErrors: { email?: string; password?: string } = {};
        if (!isRequired(email)) {
            newErrors.email = 'Email is required';
        } else if (!isValidEmail(email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!isRequired(password)) {
            newErrors.password = 'Password is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
            // Call real API
            await authService.login({ email, password });
            // Navigate to dashboard on success
            navigate('/dashboard');
        } catch (error: any) {
            setErrors({
                general: error.response?.data?.detail || 'Invalid email or password. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-400 rounded-2xl mb-4 text-3xl">
                        🛡️
                    </div>
                    <h1 className="text-3xl font-bold gradient-text mb-2">ClaimGuard AI</h1>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-soft border border-gray-200 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errors.general && (
                            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm">
                                {errors.general}
                            </div>
                        )}

                        <Input
                            type="email"
                            label="Email Address"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors({ ...errors, email: undefined });
                            }}
                            error={errors.email}
                            leftIcon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            }
                        />

                        <Input
                            type="password"
                            label="Password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrors({ ...errors, password: undefined });
                            }}
                            error={errors.password}
                            leftIcon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            }
                        />

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center cursor-pointer">
                                <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                <span className="ml-2 text-gray-600">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-primary-600 hover:text-primary-700 font-medium">
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
