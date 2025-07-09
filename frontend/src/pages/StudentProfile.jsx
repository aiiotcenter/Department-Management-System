import html2canvas from 'html2canvas';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DownloadIcon from '../assets/download.png';
import QRCodeIcon from '../assets/QRCode.png';
import SettingIcon from '../assets/setting.png';
import UserIcon from '../assets/user.png';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import StudentCard from '../components/StudentCard';
import { fetchStudentAppointments, getAppointmentQrCodeUrl } from '../services/appointment';
import { fetchInternships, getInternshipQrCodeUrl } from '../services/internship';
import { fetchCurrentUserProfile } from '../services/userService';
import './StudentProfile.css';

export default function StudentProfile() {
    const { t } = useTranslation();
    const [student, setStudent] = useState({
        id: '',
        name: '',
        email: '',
        department: '',
        profileImage: null,
    });
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileError, setProfileError] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const [appointments, setAppointments] = useState([]);
    const [appointmentsLoading, setAppointmentsLoading] = useState(true);
    const [appointmentsError, setAppointmentsError] = useState(null);
    const [internships, setInternships] = useState([]);
    const [internshipsLoading, setInternshipsLoading] = useState(true);
    const [internshipsError, setInternshipsError] = useState(null);
    const [popupQR, setPopupQR] = useState(null);
    const [cardType, setCardType] = useState(null);
    const [cardData, setCardData] = useState(null);
    const cardRef = useRef(null);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    useEffect(() => {
        setProfileLoading(true);
        fetchCurrentUserProfile()
            .then((res) => {
                const user = res.user;
                setStudent({
                    id: user.User_ID || '',
                    name: user.Full_Name || '',
                    email: user.Email_address || '',
                    department: user.Department || '',
                    profileImage: user.photo || null,
                });
                setProfileLoading(false);
            })
            .catch((err) => {
                setProfileError(err.message);
                setProfileLoading(false);
            });
        // Fetch appointments
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
        // Fetch internships
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setStudent((prev) => ({
                    ...prev,
                    profileImage: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDownload = () => {
        if (!cardRef.current) {
            console.error('Card ref is not available!');
            return;
        }

        // Wait for one render tick to ensure DOM is ready
        setTimeout(() => {
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
        }, 0);
    };

    // Add a handler for downloading the student card
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
        <div className="student-profile">
            <Navbar />

            <div className="profile-container">
                <h2 className="profile-title">{t('profile.title')}</h2>
                <div className="settings-wrapper">
                    <img src={SettingIcon} alt="Settings" className="settings-icon" onClick={toggleMenu} />

                    {menuOpen && (
                        <div className="settings-menu" onMouseLeave={() => setMenuOpen(false)}>
                            <ul>
                                <li>{t('profile.editProfile')}</li>
                                <li>{t('profile.changePassword')}</li>
                                <li>{t('profile.logout')}</li>
                            </ul>
                        </div>
                    )}
                </div>

                <div className="profile-content">
                    <div className="profile-left">
                        <div className="profile-photo-wrapper">
                            <label htmlFor="profileImageUpload" className="profile-photo">
                                {profileLoading ? (
                                    <p>{t('common.loading')}</p>
                                ) : profileError ? (
                                    <p style={{ color: 'red' }}>{profileError}</p>
                                ) : (
                                    <img
                                        src={student.profileImage || UserIcon}
                                        alt="Profile"
                                        className="profile-icon"
                                    />
                                )}
                            </label>
                            <input
                                type="file"
                                id="profileImageUpload"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />
                        </div>
                        <div className="profile-attributes">
                            <p>
                                <strong>{t('profile.id')}:</strong> {student.id}
                            </p>
                            <p>
                                <strong>{t('profile.name')}:</strong> {student.name}
                            </p>
                            <p>
                                <strong>{t('profile.email')}:</strong> {student.email}
                            </p>
                            <p>
                                <strong>{t('profile.department')}:</strong> {student.department}
                            </p>
                        </div>
                    </div>
                    <div className="profile-right">
                        <div className="appointments">
                            <h3>{t('profile.appointments')}</h3>
                            {appointmentsLoading ? (
                                <p>{t('common.loading')}</p>
                            ) : appointmentsError ? (
                                <p style={{ color: 'red' }}>{appointmentsError}</p>
                            ) : appointments.length === 0 ? (
                                <p>{t('profile.noAppointments') || 'No appointments.'}</p>
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
                                                                    name: student.name,
                                                                    qrData: app.QRcode_ID,
                                                                    department: student.department,
                                                                    date: app.Visit_date,
                                                                    period: undefined,
                                                                    purpose: app.Visit_purpose,
                                                                    profileImage: student.profileImage,
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
                                                                    profileImage: student.profileImage,
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
            </div>

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
                    <StudentCard type={cardType} data={cardData} />
                </div>
            </div>

            <Footer />
        </div>
    );
}
