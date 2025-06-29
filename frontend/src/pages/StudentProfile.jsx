import html2canvas from 'html2canvas';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DownloadIcon from '../assets/download.png';
import SettingIcon from '../assets/setting.png';
import UserIcon from '../assets/user.png';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import StudentCard from '../components/StudentCard';
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
    const [menuOpen, setMenuOpen] = useState(false);

    const [appointments, setAppointments] = useState([]);
    const [internships, setInternships] = useState([]);
    const [popupQR, setPopupQR] = useState(null);
    const [cardType, setCardType] = useState(null);
    const [cardData, setCardData] = useState(null);
    const cardRef = useRef(null);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    useEffect(() => {
        setAppointments([
            {
                title: 'Advisor Meeting',
                date: 'June 21, 2025',
                status: 'approved',
                qrData: 'appointment-1',
            },
            {
                title: 'Lab Session',
                date: 'June 25, 2025',
                status: 'pending',
            },
        ]);

        setInternships([
            {
                title: 'Google Internship',
                date: 'Summer 2025',
                status: 'approved',
                qrData: 'internship-1',
            },
            {
                title: 'Meta Internship',
                date: 'Winter 2024',
                status: 'rejected',
            },
        ]);
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
                                <img src={student.profileImage || UserIcon} alt="Profile" className="profile-icon" />
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
                            <div className="card-list">
                                {appointments.map((app, i) => (
                                    <div key={i} className="info-card">
                                        <h4 className="info-title">{app.title}</h4>
                                        <p className="info-date">{app.date}</p>
                                        <p className={`info-status ${app.status}`}>
                                            {t('profile.statusLabel')}
                                            {': '}
                                            <strong>{t(`profile.status.${app.status}`)}</strong>
                                        </p>

                                        {app.status === 'approved' && app.qrData && (
                                            <div className="qr-section">
                                                <QRCodeCanvas
                                                    value={app.QRCodeCanvas}
                                                    size={25}
                                                    data-qr={app.QRCodeCanvas}
                                                    onClick={() => setPopupQR(QRCodeCanvas)}
                                                    style={{ cursor: 'pointer' }}
                                                />

                                                <div className="download-wrapper">
                                                    <img
                                                        src={DownloadIcon}
                                                        alt="Download"
                                                        className="download-icon"
                                                        onClick={() => {
                                                            setCardType('appointment'); // or 'internship'
                                                            setCardData({
                                                                id: student.id,
                                                                name: student.name,
                                                                department: student.department,
                                                                date: app.date,
                                                                purpose: app.title,
                                                                qrData: app.qrData,
                                                                profileImage: student.profileImage,
                                                            });

                                                            setTimeout(() => handleDownload(), 100); // small delay to let card render
                                                        }}
                                                    />
                                                    <span className="tooltip-text">{t('profile.downloadCard')}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="internships">
                            <h3>{t('profile.internships')}</h3>
                            <div className="card-list">
                                {internships.map((intern, i) => (
                                    <div key={i} className="info-card">
                                        <h4 className="info-title">{intern.title}</h4>
                                        <p className="info-date">{intern.date}</p>
                                        <p className={`info-status ${intern.status}`}>
                                            {t('profile.statusLabel')}
                                            {': '}
                                            <strong>{t(`profile.status.${intern.status}`)}</strong>
                                        </p>

                                        {intern.status === 'approved' && intern.qrData && (
                                            <div className="qr-section">
                                                <QRCodeCanvas
                                                    value={intern.qrData}
                                                    size={25}
                                                    data-qr={intern.qrData}
                                                    onClick={() => setPopupQR(intern.qrData)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <div className="download-wrapper">
                                                    <img
                                                        src={DownloadIcon}
                                                        alt="Download"
                                                        className="download-icon"
                                                        onClick={() => {
                                                            setCardType('internship'); // or 'internship'
                                                            setCardData({
                                                                id: student.id,
                                                                name: student.name,
                                                                department: student.department,
                                                                date: intern.date,
                                                                purpose: intern.title,
                                                                qrData: intern.qrData,
                                                                profileImage: student.profileImage,
                                                            });

                                                            setTimeout(() => handleDownload(), 100); // small delay to let card render
                                                        }}
                                                    />
                                                    <span className="tooltip-text">{t('profile.downloadCard')}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {popupQR && (
                <div className="qr-popup-overlay" onClick={() => setPopupQR(null)}>
                    <div className="qr-popup">
                        <QRCodeCanvas value={popupQR} size={256} />
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
