import { useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import EmployeeManagement from '../partials/AdminDashboard/EmployeeManagement';
import RequestsManagement from '../partials/AdminDashboard/RequestsManagement';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('requests');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'requests':
                return <RequestsManagement />;
            case 'employees':
                return <EmployeeManagement />;
            default:
                return <RequestsManagement />;
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
                                className={activeTab === 'requests' ? 'active' : ''}
                                onClick={() => setActiveTab('requests')}
                            >
                                Requests Management
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
