import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import './StudentDashboard.css';

function StudentDashboard() {
    const profile = {
        name: 'Mohamed Alfutahi',
        id: '22208724',
        photo: '/path-to-photo.jpg',
    };

    const announcements = ['Final exams start July 5', 'Internship deadline: June 30', 'Advisor meetings now open'];
    return (
        <>
            <Navbar />
            <div className="student-dashboard-layout">
                {/* Sidebar */}
                <div className="sidebar">
                    <h2>Student Dashboard</h2>
                    <div className="summary-card">
                        <img src={profile.photo} alt="Profile" className="profile-img" />
                        <div className="profile-info">
                            <p>ID: {profile.id}</p>
                            <p>{profile.name}</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="dashboard-main">
                    <div className="welcome-heading">
                        <h1>Welcome Back!</h1>
                    </div>
                    <div className="SideBySide">
                        <div className="info-section">
                            <div className="summary-section">
                                <div className="dashboard-cards">
                                    <div className="dashboard-card">Apply for Internship</div>
                                    <div className="dashboard-card">Request Appointment</div>
                                    <div className="dashboard-card">View Profile</div>
                                </div>
                            </div>
                        </div>

                        <div className="announcement-box">
                            <h3>Announcements</h3>
                            <ul>
                                {announcements.map((note, index) => (
                                    <li key={index} className="announcement-item">
                                        <span>{note}</span>
                                        <button className="view-button">View</button>
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
