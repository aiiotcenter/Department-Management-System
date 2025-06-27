import { Route, Routes } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import Announcement from './pages/Announcement';
import AppointmentPage from './pages/AppointmentPage';
import HomePage from './pages/HomePage';
import InternshipPage from './pages/InternshipPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/profile" element={<StudentProfile />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            <Route path="/internship" element={<InternshipPage />} />
            <Route path="/announcements" element={<Announcement />} />
        </Routes>
    );
}

export default App;
