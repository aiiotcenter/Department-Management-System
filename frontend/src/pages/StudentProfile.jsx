import { useEffect, useState } from 'react';
import SettingIcon from '../assets/setting.png';
import UserIcon from '../assets/user.png';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

import './StudentProfile.css';

export default function StudentProfile() {
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

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    useEffect(() => {
        // Simulate API response
        setStudent({
            id: '20231399',
            name: 'John Doe',
            email: 'johndoe@example.com',
            department: 'Computer Engineering',
            profileImage: null,
        });

        setAppointments(['Advisor Meeting - June 21', 'Lab Session - June 25', 'Project Review - July 1']);

        setInternships(['Google - Summer 2025', 'Meta - Winter 2024', 'NEU AI Lab - Ongoing']);
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
                            <strong>Appointments:</strong>
                            <ul>
                                {appointments.length > 0 ? (
                                    appointments.map((app, index) => <li key={index}>{app}</li>)
                                ) : (
                                    <li>No Appointments</li>
                                )}
                            </ul>
                        </div>
                        <div className="internships">
                            <strong>Internships:</strong>
                            <ul>
                                {internships.length > 0 ? (
                                    internships.map((intern, index) => <li key={index}>{intern}</li>)
                                ) : (
                                    <li>No Internships</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
