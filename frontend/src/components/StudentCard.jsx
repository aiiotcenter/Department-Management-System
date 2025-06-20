import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useRef } from 'react';
import './StudentCard.css';

export default function StudentCard({ type, data, onReady }) {
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
            <h2 className="student-card-title">Student Card</h2>
            <div className="student-card-body">
                <div className="student-card-left">
                    <img src={profileImage || '/default-profile.png'} alt="Student" className="student-photo" />
                    <div className="student-info">
                        <p>
                            <strong>ID:</strong> {id}
                        </p>
                        <p>
                            <strong>Name:</strong> {name}
                        </p>
                        {type === 'appointment' && (
                            <>
                                <p>
                                    <strong>Purpose:</strong> {purpose}
                                </p>
                                <p>
                                    <strong>Date:</strong> {date}
                                </p>
                                <p>
                                    <strong>Department:</strong> {department}
                                </p>
                            </>
                        )}
                        {type === 'internship' && (
                            <>
                                <p>
                                    <strong>Department:</strong> {department}
                                </p>
                                <p>
                                    <strong>Period:</strong> {period}
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
