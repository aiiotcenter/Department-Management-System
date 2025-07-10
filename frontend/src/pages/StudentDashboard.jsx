import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { fetchAnnouncements } from '../services/announcement';
import { fetchCurrentUserProfile } from '../services/userService';
import { fetchStudentAppointments } from '../services/appointment';
import { fetchInternships } from '../services/internship';
import './StudentDashboard.css';
import QRCodeIcon from '../assets/QRCode.png';
import DownloadIcon from '../assets/download.png';
import html2canvas from 'html2canvas';
import { getAppointmentQrCodeUrl } from '../services/appointment';
import { getInternshipQrCodeUrl } from '../services/internship';
import StudentCard from '../components/StudentCard';

function StudentDashboard() {
    const { t } = useTranslation();
    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileError, setProfileError] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const [announcementsLoading, setAnnouncementsLoading] = useState(true);
    const [announcementsError, setAnnouncementsError] = useState(null);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [appointmentsLoading, setAppointmentsLoading] = useState(true);
    const [appointmentsError, setAppointmentsError] = useState(null);
    const [internships, setInternships] = useState([]);
    const [internshipsLoading, setInternshipsLoading] = useState(true);
    const [internshipsError, setInternshipsError] = useState(null);
    const closeModal = () => setSelectedAnnouncement(null);
    const [popupQR, setPopupQR] = useState(null);
    const [cardType, setCardType] = useState(null);
    const [cardData, setCardData] = useState(null);
    const cardRef = useRef(null);

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

    useEffect(() => {
        setAppointmentsLoading(true);
        fetchStudentAppointments()
            .then((data) => {
                setAppointments(Array.isArray(data) ? data : []);
                setAppointmentsLoading(false);
            })
            .catch((err) => {
                setAppointmentsError(err.message);
                setAppointmentsLoading(false);
            });
        setInternshipsLoading(true);
        fetchInternships()
            .then((data) => {
                setInternships(Array.isArray(data) ? data : []);
                setInternshipsLoading(false);
            })
            .catch((err) => {
                setInternshipsError(err.message);
                setInternshipsLoading(false);
            });
    }, []);

    const handleDownloadCard = (type, data) => {
        setCardType(type);
        setCardData(data);
        setTimeout(() => {
            if (cardRef.current) {
                html2canvas(cardRef.current, {
                    scale: 2,
                    useCORS: true,
                }).then((canvas) => {
                    const url = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'student_card.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                });
            }
        }, 100);
    };

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
                                    <div className="dashboard-card" onClick={() => window.location.href='/internship'}>
                                        {t('studentDashboard.applyInternship')}
                                    </div>
                                    <div className="dashboard-card" onClick={() => window.location.href='/appointment'}>
                                        {t('studentDashboard.requestAppointment')}
                                    </div>
                                    <div className="dashboard-card" onClick={() => window.location.href='/profile'}>
                                        {t('studentDashboard.viewProfile')}
                                    </div>
                                </div>
                                {/* Appointments Section */}
                                <div className="appointments">
                                    <h3>{t('profile.appointments')}</h3>
                                    {appointmentsLoading ? (
                                        <p>{t('common.loading')}</p>
                                    ) : appointmentsError ? (
                                        <p style={{ color: 'red' }}>{appointmentsError}</p>
                                    ) : appointments.length === 0 ? (
                                        <p>{t('profile.noAppointments')}</p>
                                    ) : (
                                        <div className="card-list">
                                            {appointments.map((app, i) => (
                                                <div key={i} className="info-card">
                                                    <h4 className="info-title">{app.Visit_purpose || app.title}</h4>
                                                    <p className="info-date">{app.Visit_date || app.date}</p>
                                                    <p className={`info-status ${app.Status || app.status}`}>
                                                        {t('profile.statusLabel')}
                                                        {': '}
                                                        <strong>
                                                            {t(
                                                                `profile.status.${(app.Status || app.status || '').toLowerCase()}`
                                                            )}
                                                        </strong>
                                                    </p>
                                                    {/* QR code icon for approved appointments */}
                                                    {(app.Status || app.status) &&
                                                        (app.Status || app.status).toLowerCase() === 'approved' &&
                                                        app.QRcode_ID && (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                <img
                                                                    src={QRCodeIcon}
                                                                    alt="QR Code"
                                                                    className="qr-code-icon"
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                        width: 32,
                                                                        height: 32,
                                                                        marginTop: 8,
                                                                    }}
                                                                    onClick={() =>
                                                                        setPopupQR(getAppointmentQrCodeUrl(app.QRcode_ID))
                                                                    }
                                                                />
                                                                <img
                                                                    src={DownloadIcon}
                                                                    alt="Download Card"
                                                                    className="download-card-icon"
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                        width: 28,
                                                                        height: 28,
                                                                        marginTop: 8,
                                                                    }}
                                                                    onClick={() =>
                                                                        handleDownloadCard('appointment', {
                                                                            id: app.Appointment_Requester_ID,
                                                                            name: profile?.Full_Name || profile?.name,
                                                                            qrData: app.QRcode_ID,
                                                                            department: profile?.Department,
                                                                            date: app.Visit_date,
                                                                            period: undefined,
                                                                            purpose: app.Visit_purpose,
                                                                            profileImage: profile?.photo,
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {/* Internships Section */}
                                <div className="internships">
                                    <h3>{t('profile.internships')}</h3>
                                    {internshipsLoading ? (
                                        <p>{t('common.loading')}</p>
                                    ) : internshipsError ? (
                                        <p style={{ color: 'red' }}>{internshipsError}</p>
                                    ) : internships.length === 0 ? (
                                        <p>{t('profile.noInternships') || 'No internships.'}</p>
                                    ) : (
                                        <div className="card-list">
                                            {internships.map((intern, i) => (
                                                <div key={i} className="info-card">
                                                    <h4 className="info-title">
                                                        {intern.title || intern.period_of_internship}
                                                    </h4>
                                                    <p className="info-date">{intern.date || intern.period_of_internship}</p>
                                                    <p className={`info-status ${intern.status || intern.Status}`}>
                                                        {t('profile.statusLabel')}
                                                        {': '}
                                                        <strong>
                                                            {t(
                                                                `profile.status.${(intern.status || intern.Status || '').toLowerCase()}`
                                                            )}
                                                        </strong>
                                                    </p>
                                                    {/* QR code icon for approved internships */}
                                                    {(intern.status || intern.Status) &&
                                                        (intern.status || intern.Status).toLowerCase() === 'approved' &&
                                                        intern.QRcode_ID && (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                <img
                                                                    src={QRCodeIcon}
                                                                    alt="QR Code"
                                                                    className="qr-code-icon"
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                        width: 32,
                                                                        height: 32,
                                                                        marginTop: 8,
                                                                    }}
                                                                    onClick={() =>
                                                                        setPopupQR(getInternshipQrCodeUrl(intern.QRcode_ID))
                                                                    }
                                                                />
                                                                <img
                                                                    src={DownloadIcon}
                                                                    alt="Download Card"
                                                                    className="download-card-icon"
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                        width: 28,
                                                                        height: 28,
                                                                        marginTop: 8,
                                                                    }}
                                                                    onClick={() =>
                                                                        handleDownloadCard('internship', {
                                                                            id: intern.User_ID,
                                                                            name: intern.User_name,
                                                                            qrData: intern.QRcode_ID,
                                                                            department: intern.department,
                                                                            date: undefined,
                                                                            period: intern.period_of_internship,
                                                                            purpose: undefined,
                                                                            profileImage: profile?.photo,
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="announcement-box">
                            <h3>{t('studentDashboard.announcements')}</h3>
                            {announcementsLoading ? (
                                <p>{t('common.loading')}</p>
                            ) : announcementsError ? (
                                <p style={{ color: 'red' }}>{t('announcement.failedToFetchAnnouncements')}</p>
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
            {/* QR Popup for both sections */}
            {popupQR && (
                <div className="qr-popup-overlay" onClick={() => setPopupQR(null)}>
                    <div className="qr-popup">
                        <img src={popupQR} alt="QR Code" style={{ width: 256, height: 256 }} />
                        <p>{t('profile.qrHelp')}</p>
                    </div>
                </div>
            )}
            <div style={{ position: 'absolute', left: '-9999px', top: '0' }}>
                <div ref={cardRef}>
                    {cardType && cardData && <StudentCard type={cardType} data={cardData} />}
                </div>
            </div>
        </>
    );
}

export default StudentDashboard;
