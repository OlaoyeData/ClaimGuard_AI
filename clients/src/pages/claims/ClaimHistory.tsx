import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonList } from '@/components/ui/Loading';
import { mockNotifications } from '@/data/mockData';
import { formatDate, getStatusLabel, formatCurrency } from '@/utils/formatters';
import { claimService } from '@/services/claimService';
import type { Claim } from '@/types';

export const ClaimHistory: React.FC = () => {
    const [claims, setClaims] = useState<Claim[]>([]);
    const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        damageType: 'all',
    });

    useEffect(() => {
        const loadClaims = async () => {
            try {
                setLoading(true);
                const data = await claimService.getClaims();
                setClaims(data);
                setFilteredClaims(data);
            } catch (err: any) {
                setError('Failed to load claims. Please try again.');
                console.error('Error loading claims:', err);
            } finally {
                setLoading(false);
            }
        };
        loadClaims();
    }, []);

    useEffect(() => {
        let filtered = claims;

        // Search filter
        if (filters.search) {
            filtered = filtered.filter(claim =>
                claim.claimNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
                claim.claimantName.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        // Status filter
        if (filters.status !== 'all') {
            filtered = filtered.filter(claim => claim.status === filters.status);
        }

        // Damage type filter
        if (filters.damageType !== 'all') {
            filtered = filtered.filter(claim => claim.damageType === filters.damageType);
        }

        setFilteredClaims(filtered);
    }, [filters, claims]);

    const getStatusVariant = (status: string) => {
        const variants: Record<string, any> = {
            approved: 'success',
            pending: 'warning',
            rejected: 'danger',
            info_requested: 'info',
        };
        return variants[status] || 'default';
    };

    if (loading) {
        return (
            <AppLayout notificationCount={mockNotifications.filter(n => !n.read).length}>
                <SkeletonList count={5} />
            </AppLayout>
        );
    }

    return (
        <AppLayout notificationCount={mockNotifications.filter(n => !n.read).length}>
            <div className="max-w-6xl mx-auto animate-fade-in">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Claim History</h1>
                    <p className="text-gray-600">View and manage all your insurance claims</p>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            placeholder="Search by claim ID or name..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            leftIcon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            }
                        />

                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="info_requested">Info Requested</option>
                        </select>

                        <select
                            value={filters.damageType}
                            onChange={(e) => setFilters({ ...filters, damageType: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="all">All Damage Types</option>
                            <option value="none">No Damage</option>
                            <option value="minor">Minor</option>
                            <option value="moderate">Moderate</option>
                            <option value="severe">Severe</option>
                        </select>
                    </div>
                </Card>

                {error && (
                    <div className="mb-4 bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Claims List */}
                {filteredClaims.length === 0 ? (
                    <EmptyState
                        icon={<div className="text-6xl">🔍</div>}
                        title="No claims found"
                        description="Try adjusting your filters or submit a new claim"
                        actionLabel="Submit New Claim"
                        onAction={() => window.location.href = '/claims/new'}
                    />
                ) : (
                    <div className="space-y-4">
                        {filteredClaims.map((claim) => (
                            <Card key={claim.id} hoverable>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4 flex-1">
                                        {/* Car Icon */}
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg flex items-center justify-center text-2xl">
                                            🚗
                                        </div>

                                        {/* Claim Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <Link
                                                    to={`/claims/${claim.id}`}
                                                    className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                                                >
                                                    {claim.claimNumber}
                                                </Link>
                                                <Badge variant={getStatusVariant(claim.status)}>
                                                    {getStatusLabel(claim.status)}
                                                </Badge>
                                            </div>

                                            <p className="text-gray-700 font-medium mb-1">
                                                {claim.vehicleInfo.year} {claim.vehicleInfo.make} {claim.vehicleInfo.model}
                                            </p>

                                            <p className="text-sm text-gray-600 mb-2">
                                                {claim.claimantName} • {claim.location}
                                            </p>

                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                <span>📅 {formatDate(claim.createdAt)}</span>
                                                {claim.aiAnalysis && (
                                                    <span>💰 {formatCurrency(claim.aiAnalysis.estimatedCost)}</span>
                                                )}
                                                {claim.damageType && (
                                                    <span className="capitalize">🔧 {claim.damageType} damage</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <Link to={`/claims/${claim.id}`}>
                                        <button className="ml-4 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                            View Details →
                                        </button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
};
