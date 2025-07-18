import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import Announcement from './pages/Announcement';
import AppointmentPage from './pages/AppointmentPage';
import HomePage from './pages/HomePage';
import InternshipPage from './pages/InternshipPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import AdminInternships from './partials/AdminDashboard/AdminInternships';

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <StudentProfile />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student-dashboard"
                element={
                    <RoleProtectedRoute allowedRoles={['student']}>
                        <StudentDashboard />
                    </RoleProtectedRoute>
                }
            />
            <Route
                path="/admin-dashboard"
                element={
                    <RoleProtectedRoute allowedRoles={['admin', 'professor', 'assistant', 'secretary']}>
                        <AdminDashboard />
                    </RoleProtectedRoute>
                }
            />
            <Route
                path="/appointment"
                element={
                    <ProtectedRoute>
                        <AppointmentPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/internship"
                element={
                    <ProtectedRoute>
                        <InternshipPage />
                    </ProtectedRoute>
                }
            />
            <Route path="/announcements" element={<Announcement />} />
            <Route
                path="/admin-dashboard/internships"
                element={
                    <RoleProtectedRoute allowedRoles={['admin', 'professor', 'assistant', 'secretary']}>
                        <AdminInternships />
                    </RoleProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
