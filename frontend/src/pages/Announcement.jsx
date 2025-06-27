import Appointment from '../assets/appointment.png';
import Event from '../assets/Event.png';
import Internship from '../assets/internship.png';
import Meeting from '../assets/meeting.png';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import './Announcement.css';

const announcements = [
    {
        title: 'Internship Deadline',
        date: '2025-06-30',
        content: 'The final date to submit your internship form is June 30.',
        type: 'Internship',
    },
    {
        title: 'Appointment with Advisor',
        date: '2025-07-05',
        content: 'your appointment with your academic advisor is scheduled for July 5.',
        type: 'Appointment',
    },
    {
        title: 'AI Management Workshop event',
        date: '2025-06-28',
        content: 'An AI Management Workshop event will be held on June 28.',
        type: 'Event',
    },
    {
        title: 'Weekly Team Meeting',
        date: '2025-07-01',
        content: 'The weekly team meeting is scheduled for July 1.',
        type: 'Meeting',
    },
];

function Announcement() {
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
                        {announcements.map((note, index) => (
                            <div key={index} className="announcement-item">
                                <h3>{note.title}</h3>
                                <p>
                                    <strong>Date:</strong> {note.date}
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
