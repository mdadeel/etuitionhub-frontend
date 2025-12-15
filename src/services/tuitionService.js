/**
 * Tuition Service - API layer for tuition endpoints
 * 
 * Centralizes all tuition-related API calls
 * Components never call fetch/axios directly
 */
import api from './api';

export const tuitionService = {
    /**
     * Get all tuitions with optional filtering
     * @param {Object} filters - Query parameters
     */
    getAll: async (filters = {}) => {
        const response = await api.get('/api/tuitions', { params: filters });
        return response.data;
    },

    /**
     * Get single tuition by ID
     */
    getById: async (id) => {
        const response = await api.get(`/api/tuitions/${id}`);
        return response.data;
    },

    /**
     * Get tuitions by student email
     */
    getByStudent: async (email) => {
        const response = await api.get(`/api/tuitions/student/${email}`);
        return response.data;
    },

    /**
     * Create new tuition post
     */
    create: async (tuitionData) => {
        const response = await api.post('/api/tuitions', tuitionData);
        return response.data;
    },

    /**
     * Update tuition by ID
     */
    update: async (id, updateData) => {
        const response = await api.patch(`/api/tuitions/${id}`, updateData);
        return response.data;
    },

    /**
     * Delete tuition by ID
     */
    delete: async (id) => {
        const response = await api.delete(`/api/tuitions/${id}`);
        return response.data;
    },

    /**
     * Update tuition status (admin only)
     */
    updateStatus: async (id, status) => {
        const response = await api.patch(`/api/tuitions/${id}`, { status });
        return response.data;
    }
};

export default tuitionService;
