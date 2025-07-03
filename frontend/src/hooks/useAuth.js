import { useEffect, useState } from 'react';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/check-auth', {
                credentials: 'include',
            });
            const data = await response.json();
            setIsAuthenticated(data.authenticated);
        } catch {
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const updateAuthStatus = (status) => {
        setIsAuthenticated(status);
    };

    return {
        isAuthenticated,
        loading,
        checkAuthStatus,
        updateAuthStatus,
    };
}
