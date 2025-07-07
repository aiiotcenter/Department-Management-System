// src/hooks/useUsers.js

import { useCallback, useState } from 'react';
import { fetchStaffUsers } from '../services/internship';
import { deleteUser, fetchAllUsers } from '../services/userService';

// Simple version for debugging
export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [staffUsers, setStaffUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all users
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedUsers = await fetchAllUsers();
            if (Array.isArray(fetchedUsers)) {
                // Map the backend user data structure to our component's structure
                const mappedUsers = fetchedUsers.map((user) => ({
                    _id: user.User_ID,
                    name: user.User_name,
                    email: user.Email_address,
                    role: user.User_Role ? user.User_Role.toLowerCase() : 'student', // Add null check and default to 'student'
                }));
                setUsers(mappedUsers);
            } else {
                setUsers([]);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err.message);
            setUsers([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch staff users
    const fetchStaff = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedStaff = await fetchStaffUsers();
            if (Array.isArray(fetchedStaff)) {
                setStaffUsers(fetchedStaff);
            } else {
                setStaffUsers([]);
            }
        } catch (err) {
            console.error('Error fetching staff users:', err);
            setError(err.message);
            setStaffUsers([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    }, []);

    // Refresh both users and staff data
    const refreshAllUsers = useCallback(async () => {
        await Promise.all([fetchUsers(), fetchStaff()]);
    }, [fetchUsers, fetchStaff]);

    // Delete user and refresh data
    const removeUser = useCallback(
        async (userId) => {
            try {
                await deleteUser(userId);
                // Refresh both lists after deletion
                await refreshAllUsers();
                return { success: true };
            } catch (err) {
                console.error('Error deleting user:', err);
                setError(err.message);
                return { success: false, error: err.message };
            }
        },
        [refreshAllUsers]
    );

    return {
        users,
        staffUsers,
        loading,
        error,
        fetchUsers,
        fetchStaff,
        refreshAllUsers,
        removeUser,
    };
};

export default useUsers;
