// userService.js - Handles API calls related to user management

/**
 * Fetches all users from the backend
 * @returns {Promise<Array>} List of users
 */
export const fetchAllUsers = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/admin/users', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('You are not authorized to access this resource');
            }
            const errorData = await response.json();
            throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

/**
 * Adds a new user to the system
 * @param {Object} userData - User data (name, email, password, role)
 * @returns {Promise<Object>} Created user data
 */
export const addUser = async (userData) => {
    try {
        const response = await fetch('http://localhost:3001/api/admin/add_employee', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('You are not authorized to add users');
            }
            const errorData = await response.json();
            throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};

/**
 * Updates an existing user
 * @param {string} id - User ID
 * @param {Object} userData - Updated user data (name, email, role)
 * @returns {Promise<Object>} Updated user data
 */
export const updateUser = async (id, userData) => {
    try {
        const response = await fetch(`http://localhost:3001/api/admin/update_employee/${id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('You are not authorized to update users');
            } else if (response.status === 404) {
                throw new Error('User not found');
            }
            const errorData = await response.json();
            throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

/**
 * Deletes a user from the system
 * @param {string} id - User ID to delete
 * @returns {Promise<Object>} Response data
 */
export const deleteUser = async (id) => {
    try {
        const response = await fetch(`http://localhost:3001/api/admin/delete_employee/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('You are not authorized to delete users');
            } else if (response.status === 404) {
                throw new Error('User not found');
            }
            const errorData = await response.json();
            throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

/**
 * Fetches the current logged-in user's profile
 * @returns {Promise<Object>} User profile data
 */
export const fetchCurrentUserProfile = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/homepage', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('You are not authorized to access this resource');
            }
            const errorData = await response.json();
            throw new Error(errorData.message || `Server error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching current user profile:', error);
        throw error;
    }
};
