import { useEffect, useState } from 'react';
import Appointment from '../assets/appointment.png';
import Event from '../assets/Event.png';
import Internship from '../assets/internship.png';
import Meeting from '../assets/meeting.png';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { fetchAnnouncements } from '../services/announcement';
import './Announcement.css';

function Announcement() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnnouncements()
            .then((data) => {
                setAnnouncements(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);
    return (
        <>
            <Navbar />
            <div className="announcement-page">
                <div className="announcement-sidebar">
                    <div className="announcement-label">
                        <h1>Announcements →</h1>
                    </div>
                </div>

                <div className="announcement-content">
                    <div className="announcement-cards-container">
                        <div className="announcement-card">
                            <img src={Event} alt="event" />
                            <div className="overlay-text">AI Events</div>
                        </div>
                        <div className="announcement-card">
                            <img src={Internship} alt="Internship" />
                            <div className="overlay-text">Internships</div>
                        </div>
                        <div className="announcement-card">
                            <img src={Appointment} alt="Appointment" />
                            <div className="overlay-text">Appointments</div>
                        </div>
                        <div className="announcement-card">
                            <img src={Meeting} alt="Meeting" />
                            <div className="overlay-text">Meetings</div>
                        </div>
                    </div>

                    <div className="announcement-section">
                        <h2>Latest Announcements</h2>
                        {loading && <p>Loading...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {announcements.map((note, index) => (
                            <div key={note.Announcement_ID || index} className="announcement-item">
                                <h3>{note.title}</h3>
                                <p>
                                    <strong>Date:</strong> {note.Created_At ? note.Created_At.split('T')[0] : ''}
                                </p>
                                <p>{note.content}</p>
                                <button className="view-button">View</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Announcement;
