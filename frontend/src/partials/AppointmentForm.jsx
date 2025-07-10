import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import logoAI from '../assets/logoAI.png';
import Button from '../components/Button';

import './AppointmentForm.css';

function AppointmentForm() {
    const { t } = useTranslation();
    const { register, handleSubmit, reset } = useForm();
    const [dateType, setDateType] = useState('text');
    const [timeType, setTimeType] = useState('text');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });

    const onSubmit = async (data) => {
        setIsLoading(true);
        setNotification({ show: false, type: '', message: '' });

        try {
            const response = await fetch('http://localhost:3001/api/appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    appointment_approver_id: '38308132', // Default admin ID - you may want to make this selectable
                    visit_purpose: data.purpose,
                    visit_date: data.preferredDate,
                    visit_time: data.preferredTime,
                    comments: data.description || '',
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setNotification({
                    show: true,
                    type: 'success',
                    message: result.message || t('appointment.success'),
                });
                reset(); // Clear the form
            } else {
                setNotification({
                    show: true,
                    type: 'error',
                    message: result.message || t('appointment.error'),
                });
            }
        } catch (error) {
            console.error('Appointment submission error:', error);
            setNotification({
                show: true,
                type: 'error',
                message: t('appointment.networkError') || 'Network error occurred',
            });
        } finally {
            setIsLoading(false);
            // Hide notification after 5 seconds
            setTimeout(() => {
                setNotification({ show: false, type: '', message: '' });
            }, 5000);
        }
    };

    return (
        <div className="form-container">
            <img src={logoAI} alt="Department Logo" className="form-logo" />
            <h2 className="form-title">{t('appointment.formTitle')}</h2>

            {notification.show && (
                <div
                    className={`notification ${notification.type}`}
                    style={{
                        padding: '10px',
                        margin: '10px 0',
                        borderRadius: '5px',
                        backgroundColor: notification.type === 'success' ? '#d4edda' : '#f8d7da',
                        border: `1px solid ${notification.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                        color: notification.type === 'success' ? '#155724' : '#721c24',
                    }}
                >
                    {notification.message}
                </div>
            )}

            <form className="form-content" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-input"
                        placeholder={t('appointment.purposePlaceholder')}
                        name="purpose"
                        {...register('purpose', { required: true })}
                    />
                </div>

                <div className="form-group">
                    <input
                        type={dateType}
                        placeholder={t('appointment.datePlaceholder')}
                        name="preferredDate"
                        className="form-input"
                        {...register('preferredDate', { required: true })}
                        onFocus={() => setDateType('date')}
                        onBlur={() => {
                            setTimeout(() => setDateType('text'), 200);
                        }}
                    />
                </div>

                <div className="form-group">
                    <input
                        type={timeType}
                        placeholder={t('appointment.timePlaceholder')}
                        name="preferredTime"
                        className="form-input"
                        {...register('preferredTime', { required: true })}
                        onFocus={() => setTimeType('time')}
                        onBlur={() => {
                            setTimeout(() => setTimeType('text'), 200);
                        }}
                    />
                </div>

                <div className="form-group">
                    <textarea
                        placeholder={t('appointment.descPlaceholder')}
                        name="description"
                        className="form-input"
                        {...register('description')}
                    />
                </div>

                <div className="button-group">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? t('appointment.submitting') || 'Submitting...' : t('appointment.submitButton')}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default AppointmentForm;
