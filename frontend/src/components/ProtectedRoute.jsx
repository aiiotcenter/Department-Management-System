import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        // Check authentication status from backend
        fetch('http://localhost:3000/api/check-auth', {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => setIsAuthenticated(data.authenticated))
            .catch(() => setIsAuthenticated(false));
    }, []);

    if (isAuthenticated === null) return null; // or a loading spinner
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
}
