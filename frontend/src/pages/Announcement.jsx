import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Appointment from '../assets/appointment.png';
import Event from '../assets/Event.png';
import Internship from '../assets/internship.png';
import Meeting from '../assets/meeting.png';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { createAnnouncement, deleteAnnouncement, fetchAnnouncements } from '../services/announcement';
import './Announcement.css';

function Announcement() {
    const { t } = useTranslation();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [createTitle, setCreateTitle] = useState('');
    const [createContent, setCreateContent] = useState('');
    const [createError, setCreateError] = useState(null);
    const [createLoading, setCreateLoading] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const { user } = useAuth(); // Get user info including role
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const closeModal = () => setSelectedAnnouncement(null);

    const loadAnnouncements = () => {
        setLoading(true);
        setError(null);
        fetchAnnouncements()
            .then((data) => {
                setAnnouncements(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreateLoading(true);
        setCreateError(null);
        try {
            await createAnnouncement({ title: createTitle, content: createContent });
            setCreateTitle('');
            setCreateContent('');
            setShowCreate(false);
            loadAnnouncements();
        } catch (err) {
            setCreateError(err.message);
        } finally {
            setCreateLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setDeleteError(null);
        try {
            await deleteAnnouncement(id);
            loadAnnouncements();
        } catch (err) {
            setDeleteError(err.message);
        }
    };

    return (
        <>
            <Navbar />
            <div className="announcement-page">
                <div className="announcement-sidebar">
                    <div className="announcement-label">
                        <h1>{t('announcement.pageTitle')} →</h1>
                    </div>
                </div>

                <div className="announcement-content">
                    <div className="announcement-cards-container">
                        <div className="announcement-card">
                            <img src={Event} alt="event" />
                            <div className="overlay-text">{t('announcement.aiEvents')}</div>
                        </div>
                        <div className="announcement-card">
                            <img src={Internship} alt="Internship" />
                            <div className="overlay-text">{t('announcement.internships')}</div>
                        </div>
                        <div className="announcement-card">
                            <img src={Appointment} alt="Appointment" />
                            <div className="overlay-text">{t('announcement.appointments')}</div>
                        </div>
                        <div className="announcement-card">
                            <img src={Meeting} alt="Meeting" />
                            <div className="overlay-text">{t('announcement.meetings')}</div>
                        </div>
                    </div>

                    <div className="announcement-section">
                        <h2>{t('announcement.latest')}</h2>
                        {/* Show Create Announcement button for staff only */}
                        {user && user?.role != 'student' && (
                            <>
                                <button
                                    className="create-announcement-button"
                                    style={{ marginBottom: '1rem', marginRight: '1rem' }}
                                    onClick={() => setShowCreate((v) => !v)}
                                >
                                    {showCreate ? t('announcement.cancel') : t('announcement.create')}
                                </button>
                                {showCreate && (
                                    <form
                                        onSubmit={handleCreate}
                                        className="create-announcement-form"
                                        style={{ marginBottom: '1rem' }}
                                    >
                                        <input
                                            type="text"
                                            placeholder={t('announcement.title')}
                                            value={createTitle}
                                            onChange={(e) => setCreateTitle(e.target.value)}
                                            required
                                            style={{ marginRight: '0.5rem' }}
                                        />
                                        <input
                                            type="text"
                                            placeholder={t('announcement.content')}
                                            value={createContent}
                                            onChange={(e) => setCreateContent(e.target.value)}
                                            required
                                            style={{ marginRight: '0.5rem' }}
                                        />
                                        <button className="submit-butten" type="submit" disabled={createLoading}>
                                            {createLoading ? t('announcement.creating') : t('announcement.submit')}
                                        </button>
                                        {createError && (
                                            <span style={{ color: 'red', marginLeft: '1rem' }}>{createError}</span>
                                        )}
                                    </form>
                                )}
                            </>
                        )}
                        {loading && <p>{t('common.loading')}</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {deleteError && <p style={{ color: 'red' }}>{deleteError}</p>}
                        {announcements.map((note, index) => (
                            <div key={note.Announcement_ID || index} className="announcement-item">
                                <h3>{note.Title}</h3>
                                <p>
                                    <strong>Date:</strong> {note.Created_At ? note.Created_At.split('T')[0] : ''}
                                </p>
                                <p>{note.Content.length > 50 ? `${note.Content.slice(0, 50)}...` : note.Content}</p>

                                <button className="view-button" onClick={() => setSelectedAnnouncement(note)}>
                                    {t('announcement.view')}
                                </button>
                                {/* Show Delete button for staff only, next to View */}
                                {user && user?.role != 'student' && (
                                    <button
                                        className="delete-announcement-button"
                                        style={{ marginLeft: '0.5rem' }}
                                        onClick={() => handleDelete(note.Announcement_ID)}
                                    >
                                        {t('announcement.delete')}
                                    </button>
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
