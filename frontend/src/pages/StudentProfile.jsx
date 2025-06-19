import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useState } from 'react';
import DownloadIcon from '../assets/download.png';
import SettingIcon from '../assets/setting.png';
import UserIcon from '../assets/user.png';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import './StudentProfile.css';

export default function StudentProfile() {
    const [student, setStudent] = useState({
        id: '846483878463',
        name: 'Mohamed mahmoud ahmed alfutahi',
        email: 'jaldgjcjadsgjhad@hjdsvhdh',
        department: 'Softeware Engineering',
        profileImage: null,
    });
    const [menuOpen, setMenuOpen] = useState(false);

    const [appointments, setAppointments] = useState([]);
    const [internships, setInternships] = useState([]);
    const [popupQR, setPopupQR] = useState(null);

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

    const handleDownload = (QRCodeCanvas) => {
        const canvas = document.querySelector(`canvas[data-qr='${QRCodeCanvas}']`);
        if (!canvas) return;

        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = 'student_qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="student-profile">
            <Navbar />

            <div className="profile-container">
                <h2 className="profile-title">Student Profile</h2>
                <div className="settings-wrapper">
                    <img src={SettingIcon} alt="Settings" className="settings-icon" onClick={toggleMenu} />

                    {menuOpen && (
                        <div className="settings-menu" onMouseLeave={() => setMenuOpen(false)}>
                            <ul>
                                <li>Edit Profile</li>
                                <li>Change Password</li>
                                <li>Logout</li>
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
                                <strong>ID:</strong> {student.id}
                            </p>
                            <p>
                                <strong>Name:</strong> {student.name}
                            </p>
                            <p>
                                <strong>Email:</strong> {student.email}
                            </p>
                            <p>
                                <strong>Department:</strong> {student.department}
                            </p>
                        </div>
                    </div>
                    <div className="profile-right">
                        <div className="appointments">
                            <h3>Appointments</h3>
                            <div className="card-list">
                                {appointments.map((app, i) => (
                                    <div key={i} className="info-card">
                                        <h4 className="info-title">{app.title}</h4>
                                        <p className="info-date">{app.date}</p>
                                        <p className={`info-status ${app.status}`}>
                                            Status: <strong>{app.status}</strong>
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
                                                        onClick={() => handleDownload(QRCodeCanvas)}
                                                    />
                                                    <span className="tooltip-text">Download student card</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="internships">
                            <h3>Internships</h3>
                            <div className="card-list">
                                {internships.map((intern, i) => (
                                    <div key={i} className="info-card">
                                        <h4 className="info-title">{intern.title}</h4>
                                        <p className="info-date">{intern.date}</p>
                                        <p className={`info-status ${intern.status}`}>
                                            Status: <strong>{intern.status}</strong>
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
                                                        onClick={() => handleDownload(intern.qrData)}
                                                    />
                                                    <span className="tooltip-text">Download student card</span>
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
                        <p>Click to close</p>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
