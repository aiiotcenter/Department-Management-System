import { useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import AppointmentManagement from '../partials/AdminDashboard/AppointmentManagement';
import EmployeeManagement from '../partials/AdminDashboard/EmployeeManagement';
import InternshipManagement from '../partials/AdminDashboard/InternshipManagement';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('appointments');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'appointments':
                return <AppointmentManagement />;
            case 'internships':
                return <InternshipManagement />;
            case 'employees':
                return <EmployeeManagement />;
            default:
                return <AppointmentManagement />;
        }
    };

    return (
        <div className="admin-dashboard-container">
            <Navbar />
            <main className="admin-dashboard-main">
                <div className="admin-dashboard-content">
                    <div className="admin-sidebar">
                        <h2>Admin Dashboard</h2>
                        <ul className="admin-nav">
                            <li
                                className={activeTab === 'appointments' ? 'active' : ''}
                                onClick={() => setActiveTab('appointments')}
                            >
                                Appointment Requests
                            </li>
                            <li
                                className={activeTab === 'internships' ? 'active' : ''}
                                onClick={() => setActiveTab('internships')}
                            >
                                Internship Applications
                            </li>
                            <li
                                className={activeTab === 'employees' ? 'active' : ''}
                                onClick={() => setActiveTab('employees')}
                            >
                                Employee Management
                            </li>
                        </ul>
                    </div>
                    <div className="admin-content">{renderTabContent()}</div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
