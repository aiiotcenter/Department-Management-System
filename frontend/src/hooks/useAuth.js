import { useEffect, useState } from 'react';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/check-auth', {
                credentials: 'include',
            });
            const data = await response.json();
            setIsAuthenticated(data.authenticated);
            if (data.authenticated) {
                setUser({
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    role: data.role,
                });
            } else {
                setUser(null);
            }
        } catch {
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const updateAuthStatus = (status, userInfo = null) => {
        setIsAuthenticated(status);
        setUser(userInfo);
    };

    return {
        isAuthenticated,
        user,
        loading,
        checkAuthStatus,
        updateAuthStatus,
    };
}
