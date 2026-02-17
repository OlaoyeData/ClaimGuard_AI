import { User, Claim, Notification, DashboardStats } from '@/types';

// Mock current user
export const currentUser: User = {
    id: '1',
    name: 'Sarah Miller',
    email: 'sarah.miller@claimguard.com',
    role: 'agent',
};

// Mock claims data
export const mockClaims: Claim[] = [
    {
        id: '1',
        claimNumber: 'CLM-2024-001',
        claimantId: 'user-1',
        claimantName: 'Jonathan H. Wick',
        vehicleInfo: {
            make: 'Ford',
            model: 'Mustang Mach-E',
            year: 2021,
            vin: '1FA6P8TH8L5123456',
        },
        incidentDate: '2024-10-24T08:14:00Z',
        location: 'Austin, TX',
        description: 'Front right impact damage from parking lot collision',
        images: ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
        status: 'pending',
        damageType: 'moderate',
        aiAnalysis: {
            damageSeverity: 'moderate',
            fraudRisk: 'low',
            confidenceScore: 98,
            isRealImage: true,
            verificationChecks: {
                gpsMatch: true,
                timeMatch: true,
                vinMatch: true,
            },
            estimatedCost: 4820,
        },
        policyNumber: 'P-882901-BA',
        policyType: 'Full Comprehensive',
        createdAt: '2024-10-24T08:45:00Z',
        updatedAt: '2024-10-24T08:47:00Z',
    },
    {
        id: '2',
        claimNumber: 'CLM-2024-002',
        claimantId: 'user-2',
        claimantName: 'Emily Chen',
        vehicleInfo: {
            make: 'Tesla',
            model: 'Model 3',
            year: 2023,
        },
        incidentDate: '2024-10-23T14:30:00Z',
        location: 'San Francisco, CA',
        description: 'Minor rear bumper scratch from backing incident',
        images: ['/api/placeholder/800/600', '/api/placeholder/800/600'],
        status: 'approved',
        damageType: 'minor',
        aiAnalysis: {
            damageSeverity: 'minor',
            fraudRisk: 'low',
            confidenceScore: 95,
            isRealImage: true,
            verificationChecks: {
                gpsMatch: true,
                timeMatch: true,
                vinMatch: true,
            },
            estimatedCost: 850,
        },
        policyNumber: 'P-445782-CA',
        policyType: 'Standard Coverage',
        createdAt: '2024-10-23T15:00:00Z',
        updatedAt: '2024-10-24T09:15:00Z',
    },
    {
        id: '3',
        claimNumber: 'CLM-2024-003',
        claimantId: 'user-3',
        claimantName: 'Michael Rodriguez',
        vehicleInfo: {
            make: 'Honda',
            model: 'CR-V',
            year: 2022,
        },
        incidentDate: '2024-10-22T10:00:00Z',
        location: 'Miami, FL',
        description: 'Severe side damage from intersection collision',
        images: ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
        status: 'rejected',
        damageType: 'severe',
        aiAnalysis: {
            damageSeverity: 'severe',
            fraudRisk: 'high',
            confidenceScore: 45,
            isRealImage: false,
            verificationChecks: {
                gpsMatch: false,
                timeMatch: false,
                vinMatch: true,
            },
            estimatedCost: 12500,
        },
        policyNumber: 'P-229384-FL',
        policyType: 'Basic Coverage',
        createdAt: '2024-10-22T11:30:00Z',
        updatedAt: '2024-10-23T14:20:00Z',
        comments: [
            {
                id: 'c1',
                author: 'Agent Mike Johnson',
                content: 'Image analysis shows signs of AI generation. GPS data inconsistent with claimed location.',
                timestamp: '2024-10-23T14:20:00Z',
            },
        ],
    },
    {
        id: '4',
        claimNumber: 'CLM-2024-004',
        claimantId: 'user-4',
        claimantName: 'Sarah Thompson',
        vehicleInfo: {
            make: 'Toyota',
            model: 'Camry',
            year: 2020,
        },
        incidentDate: '2024-10-25T16:45:00Z',
        location: 'Seattle, WA',
        description: 'Hail damage to hood and roof',
        images: ['/api/placeholder/800/600', '/api/placeholder/800/600'],
        status: 'info_requested',
        damageType: 'moderate',
        policyNumber: 'P-667234-WA',
        policyType: 'Full Comprehensive',
        createdAt: '2024-10-25T17:00:00Z',
        updatedAt: '2024-10-25T17:30:00Z',
    },
    {
        id: '5',
        claimNumber: 'CLM-2024-005',
        claimantId: 'user-5',
        claimantName: 'David Park',
        vehicleInfo: {
            make: 'BMW',
            model: 'X5',
            year: 2023,
        },
        incidentDate: '2024-10-21T09:20:00Z',
        location: 'New York, NY',
        description: 'Front bumper damage from low-speed collision',
        images: ['/api/placeholder/800/600'],
        status: 'approved',
        damageType: 'minor',
        aiAnalysis: {
            damageSeverity: 'minor',
            fraudRisk: 'low',
            confidenceScore: 92,
            isRealImage: true,
            verificationChecks: {
                gpsMatch: true,
                timeMatch: true,
                vinMatch: true,
            },
            estimatedCost: 2100,
        },
        policyNumber: 'P-998745-NY',
        policyType: 'Premium Coverage',
        createdAt: '2024-10-21T10:00:00Z',
        updatedAt: '2024-10-22T11:45:00Z',
    },
];

// Mock notifications
export const mockNotifications: Notification[] = [
    {
        id: 'n1',
        type: 'claim_submitted',
        title: 'New Claim Submitted',
        message: 'Claim CLM-2024-001 has been submitted by Jonathan H. Wick',
        claimId: '1',
        read: false,
        timestamp: '2024-10-24T08:45:00Z',
    },
    {
        id: 'n2',
        type: 'claim_approved',
        title: 'Claim Approved',
        message: 'Your claim CLM-2024-002 has been approved. Estimated payout: $850',
        claimId: '2',
        read: false,
        timestamp: '2024-10-24T09:15:00Z',
    },
    {
        id: 'n3',
        type: 'claim_rejected',
        title: 'Claim Rejected',
        message: 'Claim CLM-2024-003 has been rejected due to AI image detection.',
        claimId: '3',
        read: true,
        timestamp: '2024-10-23T14:20:00Z',
    },
    {
        id: 'n4',
        type: 'info_requested',
        title: 'Additional Information Needed',
        message: 'Please provide additional photos for claim CLM-2024-004',
        claimId: '4',
        read: true,
        timestamp: '2024-10-25T17:30:00Z',
    },
];

// Mock dashboard stats
export const mockDashboardStats: DashboardStats = {
    totalClaims: mockClaims.length,
    approvedClaims: mockClaims.filter(c => c.status === 'approved').length,
    pendingClaims: mockClaims.filter(c => c.status === 'pending').length,
    rejectedClaims: mockClaims.filter(c => c.status === 'rejected').length,
    averageProcessingTime: 24,
};

// Simulate async API calls
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchClaims = async (): Promise<Claim[]> => {
    await delay(800);
    return mockClaims;
};

export const fetchClaimById = async (id: string): Promise<Claim | undefined> => {
    await delay(500);
    return mockClaims.find(c => c.id === id);
};

export const fetchNotifications = async (): Promise<Notification[]> => {
    await delay(300);
    return mockNotifications;
};

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
    await delay(400);
    return mockDashboardStats;
};
