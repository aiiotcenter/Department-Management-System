import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import logoAI from '../assets/logoAI.png';
import Button from '../components/Button';

import './AppointmentForm.css';

function AppointmentForm() {
    const { t } = useTranslation();
    const { register, handleSubmit } = useForm();
    const onSubmit = (data) => console.log(data);
    const [dateType, setDateType] = useState('text');
    const [timeType, setTimeType] = useState('text');

    return (
        <div className="form-container">
            <img src={logoAI} alt="Department Logo" className="form-logo" />
            <h2 className="form-title">{t('appointment.formTitle')}</h2>
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
                    <Button type="submit">{t('appointment.submitButton')}</Button>
                </div>
            </form>
        </div>
    );
}

export default AppointmentForm;
