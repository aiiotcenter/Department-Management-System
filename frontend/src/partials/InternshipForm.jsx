import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import logoAI from '../assets/logoAI.png';
import Button from '../components/Button';
import Input from '../components/Input';
import './InternshipForm.css';

export default function InternshipForm() {
    const { t } = useTranslation();
    const { register, handleSubmit } = useForm();
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        }
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('university', data.university);
        formData.append('department', data.department);
        formData.append('period_of_internship', data.period_of_internship);
        formData.append('additional_notes', data.additional_notes || '');

        if (data.cv && data.cv.length > 0) {
            const file = data.cv[0];
            formData.append('cv', file);
        }

        try {
            const response = await fetch('http://localhost:3001/api/internship_application', {
                method: 'POST',
                credentials: 'include',
                body: formData,
                // Don't set Content-Type header, let the browser set it with the boundary
            });

            const responseData = await response.json();

            if (response.ok) {
                alert('Internship application submitted!');
            } else {
                alert(`Submission failed: ${responseData.message || 'Unknown error'}`);
            }
        } catch (error) {
            alert(`Error: ${error.message || 'Unknown error occurred'}`);
        }
    };

    return (
        <div className="form-container">
            <img src={logoAI} alt="Department Logo" className="form-logo" />
            <h2 className="form-title">{t('internship.formTitle')}</h2>
            <form className="form-content" onSubmit={handleSubmit(onSubmit)}>
                <Input
                    type="text"
                    placeholder={t('internship.universityPlaceholder')}
                    name="university"
                    register={register}
                    required
                />
                <Input
                    type="text"
                    placeholder={t('internship.departmentPlaceholder')}
                    name="department"
                    register={register}
                    required
                />
                <Input
                    type="text"
                    placeholder={t('internship.durationPlaceholder')}
                    name="period_of_internship"
                    register={register}
                    required
                />
                <textarea
                    rows="4"
                    cols="50"
                    placeholder={t('internship.notesPlaceholder')}
                    className="form-textarea"
                    {...register('additional_notes')}
                />

                <div className="file-upload-container">
                    <label htmlFor="cv-upload" className="file-upload-label">
                        {t('internship.uploadCV')}
                    </label>
                    <input
                        id="cv-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="file-upload-input"
                        {...register('cv', { required: true })}
                        onChange={handleFileChange}
                    />
                    {fileName && (
                        <div className="file-name">
                            <span>{t('internship.selectedFile')}</span> {fileName}
                        </div>
                    )}
                </div>

                <div className="button-group">
                    <Button type="submit">{t('internship.submitButton')}</Button>
                </div>
            </form>
        </div>
    );
}
