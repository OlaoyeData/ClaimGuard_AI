import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ProgressStepper } from '@/components/claims/ProgressStepper';
import { ImageUpload } from '@/components/claims/ImageUpload';
import { DamageSelector } from '@/components/claims/DamageSelector';
import { mockNotifications } from '@/data/mockData';
import { claimService } from '@/services/claimService';
import { authService } from '@/services/authService';

const steps = ['Basic Info', 'Upload Photos', 'Damage Type', 'Review'];

export const NewClaim: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        vehicleMake: '',
        vehicleModel: '',
        vehicleYear: '',
        incidentDate: '',
        incidentTime: '',
        location: '',
        description: '',
        images: [] as File[],
        damageType: '',
    });

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Submit claim
            await handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            const user = authService.getStoredUser();
            if (!user) {
                navigate('/login');
                return;
            }

            // Create claim with API
            await claimService.createClaim({
                claimant_name: user.name,
                vehicle_make: formData.vehicleMake,
                vehicle_model: formData.vehicleModel,
                vehicle_year: parseInt(formData.vehicleYear),
                incident_date: formData.incidentDate,
                location: formData.location,
                description: formData.description,
                policy_number: 'POL-' + Date.now(), // Generate temp policy number
                policy_type: 'Comprehensive',
                images: formData.images,
            });

            // Navigate to claim history or analysis result
            navigate('/claims/history');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to submit claim. Please try again.');
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 0:
                return formData.vehicleMake && formData.vehicleModel && formData.vehicleYear && formData.incidentDate && formData.location;
            case 1:
                return formData.images.length > 0;
            case 2:
                return formData.damageType !== '';
            case 3:
                return true;
            default:
                return false;
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Vehicle & Incident Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="Vehicle Make"
                                placeholder="e.g., Ford"
                                value={formData.vehicleMake}
                                onChange={(e) => setFormData({ ...formData, vehicleMake: e.target.value })}
                            />
                            <Input
                                label="Vehicle Model"
                                placeholder="e.g., Mustang"
                                value={formData.vehicleModel}
                                onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                            />
                            <Input
                                label="Year"
                                type="number"
                                placeholder="e.g., 2021"
                                value={formData.vehicleYear}
                                onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Incident Date"
                                type="date"
                                value={formData.incidentDate}
                                onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                            />
                            <Input
                                label="Incident Time"
                                type="time"
                                value={formData.incidentTime}
                                onChange={(e) => setFormData({ ...formData, incidentTime: e.target.value })}
                            />
                        </div>
                        <Input
                            label="Location"
                            placeholder="City, State"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                rows={4}
                                placeholder="Describe what happened..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Damage Photos</h2>
                        <p className="text-gray-600 mb-4">
                            Please upload clear photos of the damage from multiple angles. This helps us process your claim faster.
                        </p>
                        <ImageUpload
                            onImagesChange={(files) => setFormData({ ...formData, images: files })}
                            maxFiles={10}
                        />
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Select Damage Type</h2>
                        <p className="text-gray-600 mb-4">
                            Please select the option that best describes the damage to your vehicle.
                        </p>
                        <DamageSelector
                            selected={formData.damageType}
                            onChange={(value) => setFormData({ ...formData, damageType: value })}
                        />
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Review Your Claim</h2>

                        <Card>
                            <h3 className="font-semibold text-gray-900 mb-3">Vehicle Information</h3>
                            <div className="space-y-2 text-sm">
                                <p><span className="font-medium">Vehicle:</span> {formData.vehicleYear} {formData.vehicleMake} {formData.vehicleModel}</p>
                                <p><span className="font-medium">Incident Date:</span> {formData.incidentDate} at {formData.incidentTime}</p>
                                <p><span className="font-medium">Location:</span> {formData.location}</p>
                                <p><span className="font-medium">Description:</span> {formData.description || 'N/A'}</p>
                            </div>
                        </Card>

                        <Card>
                            <h3 className="font-semibold text-gray-900 mb-3">Photos ({formData.images.length})</h3>
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                                {formData.images.map((img, i) => (
                                    <img
                                        key={i}
                                        src={URL.createObjectURL(img)}
                                        alt={`Photo ${i + 1}`}
                                        className="w-full h-20 object-cover rounded border border-gray-200"
                                    />
                                ))}
                            </div>
                        </Card>

                        <Card>
                            <h3 className="font-semibold text-gray-900 mb-3">Damage Assessment</h3>
                            <p className="text-sm capitalize">{formData.damageType.replace('_', ' ')}</p>
                        </Card>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <AppLayout notificationCount={mockNotifications.filter(n => !n.read).length}>
            <div className="max-w-4xl mx-auto animate-fade-in">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit New Claim</h1>
                    <p className="text-gray-600">Fill out the form below to submit your insurance claim</p>
                </div>

                <Card className="mb-6">
                    <ProgressStepper steps={steps} currentStep={currentStep} />
                </Card>

                <Card>
                    {error && (
                        <div className="mb-4 bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {renderStep()}

                    <div className="mt-8 flex justify-between pt-6 border-t border-gray-200">
                        <Button
                            variant="secondary"
                            onClick={handleBack}
                            disabled={currentStep === 0}
                        >
                            ← Back
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleNext}
                            disabled={!isStepValid()}
                            isLoading={isSubmitting}
                        >
                            {currentStep === steps.length - 1 ? 'Submit Claim' : 'Next →'}
                        </Button>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
};
