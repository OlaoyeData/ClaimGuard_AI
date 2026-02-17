import React from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfidenceScore } from '@/components/claims/ConfidenceScore';
import { mockNotifications } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';

export const AnalysisResult: React.FC = () => {
    // Mock AI analysis result
    const analysis = {
        damageSeverity: 'moderate',
        fraudRisk: 'low',
        confidenceScore: 98,
        isRealImage: true,
        estimatedCost: 4820,
        verificationChecks: {
            gpsMatch: true,
            timeMatch: true,
            vinMatch: true,
        },
    };

    return (
        <AppLayout notificationCount={mockNotifications.filter(n => !n.read).length}>
            <div className="max-w-4xl mx-auto animate-fade-in">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-400 rounded-full mb-4 text-4xl animate-scale-in">
                        🤖
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Analysis Complete</h1>
                    <p className="text-gray-600">Your claim has been analyzed using advanced AI technology</p>
                </div>

                {/* Confidence Score */}
                <div className="flex justify-center mb-8">
                    <ConfidenceScore score={analysis.confidenceScore} size="lg" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Damage Severity */}
                    <Card>
                        <div className="text-center">
                            <div className="text-4xl mb-3">⚠️</div>
                            <h3 className="font-semibold text-gray-900 mb-2">Damage Severity</h3>
                            <Badge variant="warning" size="lg" className="mb-3">
                                Moderate Impact
                            </Badge>
                            <p className="text-sm text-gray-600">
                                The AI detected moderate structural damage to the front right panel. Repair recommended.
                            </p>
                        </div>
                    </Card>

                    {/* Fraud Detection */}
                    <Card>
                        <div className="text-center">
                            <div className="text-4xl mb-3">🛡️</div>
                            <h3 className="font-semibold text-gray-900 mb-2">Fraud Detection</h3>
                            <Badge variant="success" size="lg" className="mb-3">
                                Low Risk
                            </Badge>
                            <p className="text-sm text-gray-600">
                                {analysis.isRealImage ? 'Images verified as authentic' : 'Potential AI-generated content detected'}
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Verification Checks */}
                <Card className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Verification Checks</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <span className={analysis.verificationChecks.gpsMatch ? 'text-success-600' : 'text-danger-600'}>
                                    {analysis.verificationChecks.gpsMatch ? '✓' : '✕'}
                                </span>
                                <span className="text-sm font-medium text-gray-900">GPS Location Match</span>
                            </div>
                            <Badge variant={analysis.verificationChecks.gpsMatch ? 'success' : 'danger'}>
                                {analysis.verificationChecks.gpsMatch ? 'Passed' : 'Failed'}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <span className={analysis.verificationChecks.timeMatch ? 'text-success-600' : 'text-danger-600'}>
                                    {analysis.verificationChecks.timeMatch ? '✓' : '✕'}
                                </span>
                                <span className="text-sm font-medium text-gray-900">Timestamp Verification</span>
                            </div>
                            <Badge variant={analysis.verificationChecks.timeMatch ? 'success' : 'danger'}>
                                {analysis.verificationChecks.timeMatch ? 'Passed' : 'Failed'}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <span className={analysis.verificationChecks.vinMatch ? 'text-success-600' : 'text-danger-600'}>
                                    {analysis.verificationChecks.vinMatch ? '✓' : '✕'}
                                </span>
                                <span className="text-sm font-medium text-gray-900">VIN Verification</span>
                            </div>
                            <Badge variant={analysis.verificationChecks.vinMatch ? 'success' : 'danger'}>
                                {analysis.verificationChecks.vinMatch ? 'Passed' : 'Failed'}
                            </Badge>
                        </div>
                    </div>
                </Card>

                {/* Recommended Action */}
                <Card className="mb-8">
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg flex items-center justify-center text-white text-2xl flex-shrink-0">
                            ✓
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">Recommended Action</h3>
                            <p className="text-gray-700 mb-3">
                                <strong>Auto-Approve Eligible</strong> - All verification checks passed. Based on our analysis, this claim is eligible for automatic approval.
                            </p>
                            <div className="flex items-center space-x-2 text-sm">
                                <span className="text-gray-600">Estimated Repair Cost:</span>
                                <span className="font-bold text-primary-600 text-lg">
                                    {formatCurrency(analysis.estimatedCost)}
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/dashboard" className="flex-1">
                        <Button variant="secondary" className="w-full">
                            Return to Dashboard
                        </Button>
                    </Link>
                    <Link to="/claims/new" className="flex-1">
                        <Button variant="primary" className="w-full">
                            Submit Another Claim
                        </Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
};
