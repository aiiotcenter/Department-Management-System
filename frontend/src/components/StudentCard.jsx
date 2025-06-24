import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './StudentCard.css';

export default function StudentCard({ type, data, onReady }) {
    const { t } = useTranslation();
    const cardRef = useRef();

    useEffect(() => {
        if (onReady && cardRef.current) {
            onReady(cardRef.current);
        }
    }, [onReady]);

    if (!data) return null;
    const { id, name, qrData, department, date, period, purpose, profileImage } = data;

    return (
        <div className="student-card-export">
            <h2 className="student-card-title">{t('profile.title')}</h2>
            <div className="student-card-body">
                <div className="student-card-left">
                    <img src={profileImage || '/default-profile.png'} alt="Student" className="student-photo" />
                    <div className="student-info">
                        <p>
                            <strong>{t('profile.studentId')}:</strong> {id}
                        </p>
                        <p>
                            <strong>{t('profile.fullName')}:</strong> {name}
                        </p>
                        {type === 'appointment' && (
                            <>
                                <p>
                                    <strong>{t('appointment.purpose')}:</strong> {purpose}
                                </p>
                                <p>
                                    <strong>{t('adminDashboard.appointmentManagement.date')}:</strong> {date}
                                </p>
                                <p>
                                    <strong>{t('profile.department')}:</strong> {department}
                                </p>
                            </>
                        )}
                        {type === 'internship' && (
                            <>
                                <p>
                                    <strong>{t('profile.department')}:</strong> {department}
                                </p>
                                <p>
                                    <strong>{t('internship.duration')}:</strong> {period}
                                </p>
                            </>
                        )}
                    </div>
                </div>

                <div className="student-card-qr">
                    <QRCodeCanvas value={qrData} size={120} />
                </div>
            </div>
        </div>
    );
}
