/**
 * User Service - API layer for user endpoints
 */
import api from './api';

export const userService = {
    getAll: async () => {
        const response = await api.get('/api/users');
        return response.data;
    },

    getByEmail: async (email) => {
        const response = await api.get(`/api/users/${email}`);
        return response.data;
    },

    update: async (id, updateData) => {
        const response = await api.patch(`/api/users/${id}`, updateData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/api/users/${id}`);
        return response.data;
    },

    updateRole: async (id, role) => {
        const response = await api.patch(`/api/users/${id}`, { role });
        return response.data;
    }
};

export default userService;
