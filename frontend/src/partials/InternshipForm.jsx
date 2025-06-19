import { useState } from 'react';
import { useForm } from 'react-hook-form';

import logoAI from '../assets/logoAI.png';
import Button from '../components/Button';
import Input from '../components/Input';
import './InternshipForm.css';

export default function InternshipForm() {
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
            <h2 className="form-title">Apply for an Internship</h2>
            <form className="form-content" onSubmit={handleSubmit(onSubmit)}>
                <Input type="text" placeholder="University *" name="university" register={register} required />
                <Input type="text" placeholder="Department *" name="department" register={register} required />
                <Input type="text" placeholder="Duration *" name="period_of_internship" register={register} required />
                <textarea
                    rows="4"
                    cols="50"
                    placeholder="Any additional notes (optional)"
                    className="form-textarea"
                    {...register('additional_notes')}
                />

                <div className="file-upload-container">
                    <label htmlFor="cv-upload" className="file-upload-label">
                        Upload your CV *
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
                            <span>Selected file:</span> {fileName}
                        </div>
                    )}
                </div>

                <div className="button-group">
                    <Button type="submit">Submit your application</Button>
                </div>
            </form>
        </div>
    );
}
