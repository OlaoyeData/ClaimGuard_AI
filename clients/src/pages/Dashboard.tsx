import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ClaimChart } from '@/components/dashboard/ClaimChart';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui/Loading';
import { mockNotifications } from '@/data/mockData';
import { formatDate, getStatusLabel } from '@/utils/formatters';
import { claimService } from '@/services/claimService';
import type { DashboardStats } from '@/types';

export const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentClaims, setRecentClaims] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch claims from backend
                const claimsData = await claimService.getClaims();

                // Calculate stats from claims
                const calculatedStats: DashboardStats = {
                    totalClaims: claimsData.length,
                    approvedClaims: claimsData.filter(c => c.status === 'approved').length,
                    pendingClaims: claimsData.filter(c => c.status === 'pending').length,
                    rejectedClaims: claimsData.filter(c => c.status === 'rejected').length,
                    averageProcessingTime: 0, // Calculate if needed
                };

                setStats(calculatedStats);
                setRecentClaims(claimsData.slice(0, 5));
                setLoading(false);
            } catch (error) {
                console.error('Error loading dashboard data:', error);
                setLoading(false);
            }
        };
        loadData();
    }, []);

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout notificationCount={mockNotifications.filter(n => !n.read).length}>
            {/* Page Header */}
            <div className="mb-8 animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's your claims overview.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    icon="📊"
                    label="Total Claims"
                    value={stats.totalClaims}
                    trend={{ value: 12, isPositive: true }}
                    color="blue"
                />
                <StatsCard
                    icon="✅"
                    label="Approved"
                    value={stats.approvedClaims}
                    trend={{ value: 8, isPositive: true }}
                    color="green"
                />
                <StatsCard
                    icon="⏳"
                    label="Pending"
                    value={stats.pendingClaims}
                    color="yellow"
                />
                <StatsCard
                    icon="🚫"
                    label="Rejected"
                    value={stats.rejectedClaims}
                    trend={{ value: 3, isPositive: false }}
                    color="red"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ClaimChart type="line" />
                <ClaimChart type="pie" />
            </div>

            {/* Recent Claims */}
            <Card
                header={
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Recent Claims</h3>
                        <Link to="/claims/history">
                            <Button variant="ghost" size="sm">View All →</Button>
                        </Link>
                    </div>
                }
                className="animate-fade-in"
            >
                <div className="divide-y divide-gray-200">
                    {recentClaims.map((claim) => (
                        <div key={claim.id} className="py-4 first:pt-0 last:pb-0">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">🚗</span>
                                    <div>
                                        <Link
                                            to={`/claims/${claim.id}`}
                                            className="font-semibold text-gray-900 hover:text-primary-600"
                                        >
                                            {claim.claimNumber}
                                        </Link>
                                        <p className="text-sm text-gray-600">{claim.claimantName}</p>
                                    </div>
                                </div>
                                <Badge variant={getStatusVariant(claim.status)}>
                                    {getStatusLabel(claim.status)}
                                </Badge>
                            </div>
                            <div className="text-sm text-gray-500 ml-11">
                                {claim.vehicleInfo.year} {claim.vehicleInfo.make} {claim.vehicleInfo.model} • {formatDate(claim.createdAt)}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-wrap gap-4 animate-fade-in">
                <Link to="/claims/new">
                    <Button variant="primary" size="lg">
                        ➕ Submit New Claim
                    </Button>
                </Link>
                <Link to="/claims/queue">
                    <Button variant="secondary" size="lg">
                        📥 View Claims Queue
                    </Button>
                </Link>
            </div>
        </AppLayout>
    );
};
