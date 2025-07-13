import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RoleProtectedRoute({ children, allowedRoles = [] }) {
    const { isAuthenticated, user, loading } = useAuth();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (loading === false) {
            setIsChecking(false);
        }
    }, [loading]);

    // Show loading while checking authentication
    if (isChecking || loading) {
        return <div>Loading...</div>;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated but no user data, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user's role is in the allowed roles
    const userRole = user.role?.toLowerCase();
    const hasPermission = allowedRoles.length === 0 || allowedRoles.includes(userRole);

    // If user doesn't have permission, redirect based on their role
    if (!hasPermission) {
        if (userRole === 'student') {
            return <Navigate to="/student-dashboard" replace />;
        } else {
            return <Navigate to="/admin-dashboard" replace />;
        }
    }

    return children;
}
