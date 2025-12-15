/**
 * useUsers Hook
 * 
 * Custom hook for fetching and managing users data
 * Used in admin dashboard for user management
 */
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useUsers(filters = {}) {
    const [userList, setUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setFetchError(null);

        try {
            const response = await api.get('/api/users');
            setUserList(response.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setFetchError(err.response?.data?.error || 'Failed to load users');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    /**
     * Update user role - with optimistic update
     */
    const updateUserRole = async (userId, newRole) => {
        const originalList = [...userList];

        // Optimistic update
        setUserList(prev => prev.map(u =>
            u._id === userId ? { ...u, role: newRole } : u
        ));

        try {
            await api.patch(`/api/users/${userId}`, { role: newRole });
            return true;
        } catch (err) {
            // Rollback
            setUserList(originalList);
            throw err;
        }
    };

    /**
     * Delete user - with optimistic update
     */
    const deleteUser = async (userId) => {
        const originalList = [...userList];

        // Optimistic update
        setUserList(prev => prev.filter(u => u._id !== userId));

        try {
            await api.delete(`/api/users/${userId}`);
            return true;
        } catch (err) {
            // Rollback
            setUserList(originalList);
            throw err;
        }
    };

    return {
        users: userList,
        loading: isLoading,
        error: fetchError,
        refetch: fetchUsers,
        updateUserRole,
        deleteUser
    };
}

export default useUsers;
