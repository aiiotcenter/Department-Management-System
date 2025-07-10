import html2canvas from 'html2canvas';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DownloadIcon from '../assets/download.png';
import QRCodeIcon from '../assets/QRCode.png';
import SettingIcon from '../assets/setting.png';
import UserIcon from '../assets/user.png';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import StudentCard from '../components/StudentCard';
import { fetchStudentAppointments, getAppointmentQrCodeUrl } from '../services/appointment';
import { changePassword, logout } from '../services/auth';
import { fetchInternships, getInternshipQrCodeUrl } from '../services/internship';
import { fetchCurrentUserProfile, updateUser } from '../services/userService';
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

    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [editProfileData, setEditProfileData] = useState({ name: student.name, email: student.email });
    const [editProfileLoading, setEditProfileLoading] = useState(false);
    const [editProfileError, setEditProfileError] = useState('');
    const [editProfileSuccess, setEditProfileSuccess] = useState('');

    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [changePasswordData, setChangePasswordData] = useState({ current: '', new: '', confirm: '' });
    const [changePasswordLoading, setChangePasswordLoading] = useState(false);
    const [changePasswordError, setChangePasswordError] = useState('');
    const [changePasswordSuccess, setChangePasswordSuccess] = useState('');

    const navigate = useNavigate();

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const handleEditProfileClick = () => {
        setEditProfileData({ name: student.name, email: student.email });
        setEditProfileOpen(true);
    };
    const handleEditProfileChange = (e) => {
        setEditProfileData({ ...editProfileData, [e.target.name]: e.target.value });
    };
    const handleEditProfileSubmit = async (e) => {
        e.preventDefault();
        setEditProfileLoading(true);
        setEditProfileError('');
        setEditProfileSuccess('');
        try {
            await updateUser(student.id, editProfileData);
            setEditProfileSuccess('Profile updated successfully!');
            // Optionally refresh profile data here
        } catch (err) {
            setEditProfileError(err.message || 'Failed to update profile');
        } finally {
            setEditProfileLoading(false);
        }
    };

    const handleChangePasswordClick = () => {
        setChangePasswordData({ current: '', new: '', confirm: '' });
        setChangePasswordOpen(true);
    };
    const handleChangePasswordChange = (e) => {
        setChangePasswordData({ ...changePasswordData, [e.target.name]: e.target.value });
    };
    const handleChangePasswordSubmit = async (e) => {
        e.preventDefault();
        setChangePasswordError('');
        setChangePasswordSuccess('');
        if (!changePasswordData.current || !changePasswordData.new || !changePasswordData.confirm) {
            setChangePasswordError('All fields are required.');
            return;
        }
        if (changePasswordData.new !== changePasswordData.confirm) {
            setChangePasswordError('New passwords do not match.');
            return;
        }
        setChangePasswordLoading(true);
        try {
            await changePassword(changePasswordData.current, changePasswordData.new);
            setChangePasswordSuccess('Password updated successfully!');
            setChangePasswordData({ current: '', new: '', confirm: '' });
        } catch (err) {
            setChangePasswordError(err.message || 'Failed to change password.');
        } finally {
            setChangePasswordLoading(false);
        }
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

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            alert('Logout failed. Please try again.');
        }
    };

    return (
        <div className="student-profile">
            <Navbar />

            <div className="profile-container">
                <h2 className="profile-title">{t('profile.title')}</h2>
                <div className="settings-wrapper">
                    <img src={SettingIcon} alt="Settings" className="settings-icon" onClick={toggleMenu} />

                    {/* Settings menu logic */}
                    {menuOpen && (
                        <div className="settings-menu" onMouseLeave={() => setMenuOpen(false)}>
                            <ul>
                                <li onClick={handleEditProfileClick}>{t('profile.editProfile')}</li>
                                <li onClick={handleChangePasswordClick}>{t('profile.changePassword')}</li>
                                <li onClick={handleLogout}>{t('profile.logout')}</li>
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
                        {/* Only keep profile info and settings. Remove appointments and internships sections. */}
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

            {/* Edit Profile Modal */}
            {editProfileOpen && (
                <div className="modal-overlay" onClick={() => setEditProfileOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Edit Profile</h2>
                        <form onSubmit={handleEditProfileSubmit}>
                            <label>
                                {t('name')}
                                <input name="name" value={editProfileData.name} onChange={handleEditProfileChange} />
                            </label>
                            <label>
                                {t('email')}
                                <input name="email" value={editProfileData.email} onChange={handleEditProfileChange} />
                            </label>
                            {/* Add photo upload if needed */}
                            <div className="modal-buttons">
                                <button type="submit" disabled={editProfileLoading}>
                                    {editProfileLoading ? t('common.loading') : t('edit')}
                                </button>
                                <button type="button" onClick={() => setEditProfileOpen(false)}>
                                    {t('cancel')}
                                </button>
                            </div>
                        </form>
                        {editProfileError && <p style={{ color: 'red' }}>{editProfileError}</p>}
                        {editProfileSuccess && <p style={{ color: 'green' }}>{editProfileSuccess}</p>}
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {changePasswordOpen && (
                <div className="modal-overlay" onClick={() => setChangePasswordOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{t('changePassword')}</h2>
                        <form onSubmit={handleChangePasswordSubmit}>
                            <label>
                                {t('currentPassword')}
                                <input
                                    type="password"
                                    name="current"
                                    value={changePasswordData.current}
                                    onChange={handleChangePasswordChange}
                                />
                            </label>
                            <label>
                                {t('newPassword')}
                                <input
                                    type="password"
                                    name="new"
                                    value={changePasswordData.new}
                                    onChange={handleChangePasswordChange}
                                />
                            </label>
                            <label>
                                {t('confirmNewPassword')}
                                <input
                                    type="password"
                                    name="confirm"
                                    value={changePasswordData.confirm}
                                    onChange={handleChangePasswordChange}
                                />
                            </label>
                            <div className="modal-buttons">
                                <button type="submit" disabled={changePasswordLoading}>
                                    {changePasswordLoading ? t('common.loading') : t('changePassword')}
                                </button>
                                <button type="button" onClick={() => setChangePasswordOpen(false)}>
                                    {t('cancel')}
                                </button>
                            </div>
                        </form>
                        {changePasswordError && <p style={{ color: 'red' }}>{changePasswordError}</p>}
                        {changePasswordSuccess && <p style={{ color: 'green' }}>{changePasswordSuccess}</p>}
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
