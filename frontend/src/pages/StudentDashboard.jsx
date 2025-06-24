import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import './StudentDashboard.css';

function StudentDashboard() {
    const { t } = useTranslation();
    const profile = {
        name: 'Mohamed Alfutahi',
        id: '22208724',
        photo: '/path-to-photo.jpg',
    };

    const announcements = [t('studentDashboard.internshipDeadline'), t('studentDashboard.advisorMeetings')];
    return (
        <>
            <Navbar />
            <div className="student-dashboard-layout">
                {/* Sidebar */}
                <div className="sidebar">
                    <h2>{t('studentDashboard.title')}</h2>
                    <div className="summary-card">
                        <img src={profile.photo} alt="Profile" className="profile-img" />
                        <div className="profile-info">
                            <p>
                                {t('studentDashboard.profileId')}: {profile.id}
                            </p>
                            <p>
                                {t('studentDashboard.profileName')}: {profile.name}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="dashboard-main">
                    <div className="welcome-heading">
                        <h1>{t('studentDashboard.welcome')}</h1>
                    </div>
                    <div className="SideBySide">
                        <div className="info-section">
                            <div className="summary-section">
                                <div className="dashboard-cards">
                                    <Link to="/internship" className="dashboard-card">
                                        {t('studentDashboard.applyInternship')}
                                    </Link>
                                    <Link to="/appointment" className="dashboard-card">
                                        {t('studentDashboard.requestAppointment')}
                                    </Link>
                                    <Link to="/profile" className="dashboard-card">
                                        {t('studentDashboard.viewProfile')}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="announcement-box">
                            <h3>{t('studentDashboard.announcements')}</h3>
                            <ul>
                                {announcements.map((note, index) => (
                                    <li key={index} className="announcement-item">
                                        <span>{note}</span>
                                        <button className="view-button">{t('studentDashboard.view')}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default StudentDashboard;
