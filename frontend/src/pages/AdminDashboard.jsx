import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import AdminInternships from '../pages/AdminInternships';
import RequestsManagement from '../partials/AdminDashboard/RequestsManagement';
import UserManagement from '../partials/AdminDashboard/UserManagement';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('requests');
    const { t } = useTranslation();

    const renderTabContent = () => {
        switch (activeTab) {
            case 'requests':
                return <RequestsManagement />;
            case 'users':
                return <UserManagement />;
            case 'internships':
                return <AdminInternships />;
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
                        <h2>{t('adminDashboard.title')}</h2>
                        <ul className="admin-nav">
                            <li
                                className={activeTab === 'requests' ? 'active' : ''}
                                onClick={() => setActiveTab('requests')}
                            >
                                {t('adminDashboard.manageRequests')}
                            </li>
                            <li className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
                                {t('adminDashboard.manageUsers')}
                            </li>
                            <li
                                className={activeTab === 'internships' ? 'active' : ''}
                                onClick={() => {
                                    setActiveTab('internships');
                                }}
                            >
                                {t('adminDashboard.manageInternships') || 'Manage Internships'}
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
