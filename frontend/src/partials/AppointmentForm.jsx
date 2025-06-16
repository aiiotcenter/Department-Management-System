import { useState } from 'react';
import { useForm } from 'react-hook-form';

import logoAI from '../assets/logoAI.png';
import Button from '../components/Button';

import './AppointmentForm.css';

function AppointmentForm() {
    const { register, handleSubmit } = useForm();
    const onSubmit = (data) => console.log(data);
    const [dateType, setDateType] = useState('text');
    const [timeType, setTimeType] = useState('text');

    return (
        <div className="form-container">
            <img src={logoAI} alt="Department Logo" className="form-logo" />
            <h2 className="form-title">Apply for an appointment</h2>
            <form className="form-content" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Purpose"
                        name="purpose"
                        {...register('purpose', { required: true })}
                    />
                </div>

                <div className="form-group">
                    <input
                        type={dateType}
                        placeholder="Preferred Date"
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
                        placeholder="Preferred Time"
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
                        placeholder="Description (optional)"
                        name="description"
                        className="form-input"
                        {...register('description')}
                    />
                </div>

                <div className="button-group">
                    <Button type="submit">Submit Appointment</Button>
                </div>
            </form>
        </div>
    );
}

export default AppointmentForm;
