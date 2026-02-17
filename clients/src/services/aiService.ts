import apiClient from './api';
import type { AIAnalysis } from '../types';

export const aiService = {
    /**
     * Analyze an image for fraud detection
     */
    async analyzeFraud(image: File): Promise<AIAnalysis> {
        const formData = new FormData();
        formData.append('image', image);

        const response = await apiClient.post<AIAnalysis>('/analyze/fraud', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    },

    /**
     * Analyze damage severity
     */
    async analyzeDamage(image: File): Promise<AIAnalysis> {
        const formData = new FormData();
        formData.append('image', image);

        const response = await apiClient.post<AIAnalysis>('/analyze/damage', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    },

    /**
     * Analyze multiple images in batch
     */
    async analyzeBatch(images: File[]): Promise<AIAnalysis[]> {
        const formData = new FormData();
        images.forEach((image) => {
            formData.append('images', image);
        });

        const response = await apiClient.post<AIAnalysis[]>('/analyze/batch', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    },
};
