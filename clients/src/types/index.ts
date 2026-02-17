export type UserRole = 'owner' | 'agent' | 'admin';

export type ClaimStatus = 'pending' | 'approved' | 'rejected' | 'info_requested';

export type DamageType = 'none' | 'minor' | 'moderate' | 'severe';

export type FraudRisk = 'low' | 'medium' | 'high';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

export interface AIAnalysis {
    damageSeverity: DamageType;
    fraudRisk: FraudRisk;
    confidenceScore: number;
    isRealImage: boolean;
    verificationChecks: {
        gpsMatch: boolean;
        timeMatch: boolean;
        vinMatch: boolean;
    };
    estimatedCost: number;
}

export interface Claim {
    id: string;
    claimNumber: string;
    claimantId: string;
    claimantName: string;
    vehicleInfo: {
        make: string;
        model: string;
        year: number;
        vin?: string;
    };
    incidentDate: string;
    location: string;
    description: string;
    images: string[];
    status: ClaimStatus;
    damageType?: DamageType;
    aiAnalysis?: AIAnalysis;
    policyNumber: string;
    policyType: string;
    createdAt: string;
    updatedAt: string;
    comments?: Comment[];
}

export interface Comment {
    id: string;
    author: string;
    content: string;
    timestamp: string;
}

export type NotificationType =
    | 'claim_submitted'
    | 'claim_approved'
    | 'claim_rejected'
    | 'info_requested'
    | 'claim_updated';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    claimId?: string;
    read: boolean;
    timestamp: string;
}

export interface DashboardStats {
    totalClaims: number;
    approvedClaims: number;
    pendingClaims: number;
    rejectedClaims: number;
    averageProcessingTime: number;
}
