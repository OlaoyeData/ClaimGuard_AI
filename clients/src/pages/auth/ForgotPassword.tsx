import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { isValidEmail, isRequired } from '@/utils/validation';

export const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isRequired(email)) {
            setError('Email is required');
            return;
        }
        if (!isValidEmail(email)) {
            setError('Please enter a valid email');
            return;
        }

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 px-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-success-600 to-success-400 rounded-2xl mb-4 text-3xl">
                            ✓
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h1>
                        <p className="text-gray-600">
                            We've sent password reset instructions to <strong>{email}</strong>
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-soft border border-gray-200 p-8 text-center">
                        <p className="text-gray-600 mb-6">
                            Didn't receive the email? Check your spam folder or try again.
                        </p>
                        <Link to="/login">
                            <Button variant="primary" className="w-full">
                                Return to Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-400 rounded-2xl mb-4 text-3xl">
                        🔒
                    </div>
                    <h1 className="text-3xl font-bold gradient-text mb-2">Forgot Password?</h1>
                    <p className="text-gray-600">No worries, we'll send you reset instructions</p>
                </div>

                <div className="bg-white rounded-2xl shadow-soft border border-gray-200 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            type="email"
                            label="Email Address"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                            }}
                            error={error}
                            leftIcon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            }
                        />

                        <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                            Send Reset Link
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
