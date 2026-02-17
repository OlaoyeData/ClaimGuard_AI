import apiClient, { getAuthHeaders } from './api';
import type { Claim, ClaimStatus } from '../types';

export interface CreateClaimData {
    claimant_name: string;
    vehicle_make: string;
    vehicle_model: string;
    vehicle_year: number;
    vehicle_vin?: string;
    incident_date: string;
    location: string;
    description: string;
    policy_number: string;
    policy_type: string;
    images?: File[];
}

export interface UpdateClaimData {
    status?: ClaimStatus;
    damage_type?: string;
    description?: string;
}

export interface ClaimFilters {
    status?: ClaimStatus;
    limit?: number;
    offset?: number;
}

export const claimService = {
    /**
     * Create a new claim with images
     */
    async createClaim(data: CreateClaimData): Promise<Claim> {
        const formData = new FormData();

        // Append all text fields
        formData.append('claimant_name', data.claimant_name);
        formData.append('vehicle_make', data.vehicle_make);
        formData.append('vehicle_model', data.vehicle_model);
        formData.append('vehicle_year', data.vehicle_year.toString());
        formData.append('incident_date', data.incident_date);
        formData.append('location', data.location);
        formData.append('description', data.description);
        formData.append('policy_number', data.policy_number);
        formData.append('policy_type', data.policy_type);

        if (data.vehicle_vin) {
            formData.append('vehicle_vin', data.vehicle_vin);
        }

        // Append images
        if (data.images) {
            data.images.forEach((image) => {
                formData.append('images', image);
            });
        }

        const response = await apiClient.post<Claim>('/claims', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...getAuthHeaders(),
            },
        });

        return response.data;
    },

    /**
     * Get all claims with optional filters
     */
    async getClaims(filters?: ClaimFilters): Promise<Claim[]> {
        const params = new URLSearchParams();

        if (filters?.status) {
            params.append('status', filters.status);
        }
        if (filters?.limit) {
            params.append('limit', filters.limit.toString());
        }
        if (filters?.offset) {
            params.append('offset', filters.offset.toString());
        }

        const response = await apiClient.get<Claim[]>(`/claims?${params.toString()}`);
        return response.data;
    },

    /**
     * Get a single claim by ID
     */
    async getClaim(claimId: string): Promise<Claim> {
        const response = await apiClient.get<Claim>(`/claims/${claimId}`);
        return response.data;
    },

    /**
     * Update a claim
     */
    async updateClaim(claimId: string, data: UpdateClaimData): Promise<Claim> {
        const response = await apiClient.put<Claim>(`/claims/${claimId}`, data);
        return response.data;
    },

    /**
     * Delete a claim
     */
    async deleteClaim(claimId: string): Promise<void> {
        await apiClient.delete(`/claims/${claimId}`);
    },
};
