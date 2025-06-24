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

    const onSubmit = (data) => {
        // Create a FormData object to handle file upload
        const formData = new FormData();

        // Add all form fields to the FormData
        Object.keys(data).forEach((key) => {
            if (key === 'cv' && data[key][0]) {
                formData.append(key, data[key][0]);
            } else {
                formData.append(key, data[key]);
            }
        });

        console.log('Form submitted with:', {
            university: data.university,
            department: data.department,
            period_of_internship: data.period_of_internship,
            additional_notes: data.additional_notes,
            cv_filename: fileName,
        });

        // Here you would typically send the formData to your backend
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
