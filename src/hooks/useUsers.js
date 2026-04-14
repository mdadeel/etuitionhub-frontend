// users hook - admin dashboard user management
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

// TODO: add pagination support
export function useUsers(filters = {}) {
    let [userList, setUserList] = useState([]);
    let [isLoading, setIsLoading] = useState(true);
    let [fetchError, setFetchError] = useState(null);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setFetchError(null);
        console.log('loading users...'); // debug - keep for now

        try {
            var res = await api.get('/api/users');
            setUserList(res.data);
            // console.log('users:', res.data.length);
        } catch (err) {
            console.error('user fetch failed:', err.message);
            setFetchError(err.response?.data?.error || 'failed to load');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // update role - optimistic update
    var updateUserRole = async (userId, newRole) => {
        var originalList = [...userList];
        setUserList(prev => prev.map(u =>
            u._id === userId ? { ...u, role: newRole } : u
        ));

        try {
            await api.patch(`/api/users/${userId}`, { role: newRole });
            return true;
        } catch (err) {
            setUserList(originalList); // rollback
            throw err;
        }
    };

    // delete user
    var deleteUser = async (userId) => {
        var originalList = [...userList];
        setUserList(prev => prev.filter(u => u._id !== userId));

        try {
            await api.delete(`/api/users/${userId}`);
            return true;
        } catch (err) {
            setUserList(originalList); // rollback
            throw err;
        }
    };

    return {
        users: userList, loading: isLoading, error: fetchError,
        refetch: fetchUsers, updateUserRole, deleteUser
    };
}

export default useUsers;
