import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { fetchAnnouncements } from '../services/announcement';
import { fetchCurrentUserProfile } from '../services/userService';
import './StudentDashboard.css';

function StudentDashboard() {
    const { t } = useTranslation();
    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileError, setProfileError] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const [announcementsLoading, setAnnouncementsLoading] = useState(true);
    const [announcementsError, setAnnouncementsError] = useState(null);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const closeModal = () => setSelectedAnnouncement(null);

    useEffect(() => {
        setProfileLoading(true);
        fetchCurrentUserProfile()
            .then((res) => {
                setProfile(res.user);
                setProfileLoading(false);
            })
            .catch((err) => {
                setProfileError(err.message);
                setProfileLoading(false);
            });
    }, []);

    useEffect(() => {
        setAnnouncementsLoading(true);
        fetchAnnouncements()
            .then((data) => {
                setAnnouncements(data);
                setAnnouncementsLoading(false);
            })
            .catch((err) => {
                setAnnouncementsError(err.message);
                setAnnouncementsLoading(false);
            });
    }, []);

    return (
        <>
            <Navbar />
            <div className="student-dashboard-layout">
                {/* Sidebar */}
                <div className="sidebar">
                    <h2>{t('studentDashboard.title')}</h2>
                    <div className="summary-card">
                        {profileLoading ? (
                            <p>{t('common.loading')}</p>
                        ) : profileError ? (
                            <p style={{ color: 'red' }}>{profileError}</p>
                        ) : profile ? (
                            <>
                                <img
                                    src={profile.photo || '/path-to-photo.jpg'}
                                    alt="Profile"
                                    className="profile-img"
                                />
                                <div className="profile-info">
                                    <p>
                                        {t('studentDashboard.profileId')}: {profile.User_ID || profile.id}
                                    </p>
                                    <p>
                                        {t('studentDashboard.profileName')}: {profile.Full_Name || profile.name}
                                    </p>
                                </div>
                            </>
                        ) : null}
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
                            {announcementsLoading ? (
                                <p>{t('common.loading')}</p>
                            ) : announcementsError ? (
                                <p style={{ color: 'red' }}>{announcementsError}</p>
                            ) : (
                                <ul>
                                    {announcements.length === 0 ? (
                                        <li>{t('studentDashboard.noAnnouncements') || 'No announcements.'}</li>
                                    ) : (
                                        announcements.map((note, index) => (
                                            <li key={note.Announcement_ID || index} className="announcement-item">
                                                <span>{note.Title || note}</span>
                                                <button
                                                    className="view-button"
                                                    onClick={() => setSelectedAnnouncement(note)}
                                                >
                                                    {t('announcement.view')}
                                                </button>
                                            </li>
                                        ))
                                    )}
                                    {selectedAnnouncement && (
                                        <div className="modal-overlay">
                                            <div className="modal-content">
                                                <h2>{selectedAnnouncement.Title}</h2>
                                                <p>{selectedAnnouncement.Content}</p>
                                                <button className="close-button" onClick={closeModal}>
                                                    {t('announcement.close')}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default StudentDashboard;
