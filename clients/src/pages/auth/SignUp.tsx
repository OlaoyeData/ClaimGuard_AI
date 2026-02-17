import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { isValidEmail, isRequired } from '@/utils/validation';
import { authService } from '@/services/authService';

export const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'owner' as 'owner' | 'agent' | 'admin',
        agreed: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
        const newErrors = { ...errors };
        delete newErrors[field];
        setErrors(newErrors);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const newErrors: Record<string, string> = {};
        if (!isRequired(formData.name)) newErrors.name = 'Name is required';
        if (!isRequired(formData.email)) {
            newErrors.email = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!isRequired(formData.password)) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.agreed) {
            newErrors.agreed = 'You must agree to the terms and conditions';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
            // Call real API
            await authService.signup({
                email: formData.email,
                password: formData.password,
                name: formData.name,
                role: formData.role
            });
            // Navigate to dashboard on success
            navigate('/dashboard');
        } catch (error: any) {
            setErrors({
                general: error.response?.data?.detail || 'Registration failed. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-400 rounded-2xl mb-4 text-3xl">
                        🛡️
                    </div>
                    <h1 className="text-3xl font-bold gradient-text mb-2">Create Account</h1>
                    <p className="text-gray-600">Get started with ClaimGuard AI</p>
                </div>

                <div className="bg-white rounded-2xl shadow-soft border border-gray-200 p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {errors.general && (
                            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm">
                                {errors.general}
                            </div>
                        )}

                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            error={errors.name}
                        />

                        <Input
                            type="email"
                            label="Email Address"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            error={errors.email}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                I am a...
                            </label>
                            <select
                                value={formData.role}
                                onChange={(e) => handleChange('role', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="owner">Vehicle Owner</option>
                                <option value="agent">Insurance Agent</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div>

                        <Input
                            type="password"
                            label="Password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            error={errors.password}
                            helperText="At least 8 characters with uppercase, lowercase, and number"
                        />

                        <Input
                            type="password"
                            label="Confirm Password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => handleChange('confirmPassword', e.target.value)}
                            error={errors.confirmPassword}
                        />

                        <div>
                            <label className="flex items-start cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.agreed}
                                    onChange={(e) => handleChange('agreed', e.target.checked)}
                                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    I agree to the{' '}
                                    <a href="#" className="text-primary-600 hover:text-primary-700">Terms of Service</a>
                                    {' '}and{' '}
                                    <a href="#" className="text-primary-600 hover:text-primary-700">Privacy Policy</a>
                                </span>
                            </label>
                            {errors.agreed && <p className="mt-1 text-sm text-danger-600">{errors.agreed}</p>}
                        </div>

                        <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
