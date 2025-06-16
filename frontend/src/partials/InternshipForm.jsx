import { useForm } from 'react-hook-form';

import logoAI from '../assets/logoAI.png';
import Button from '../components/Button';
import Input from '../components/Input';
import './InternshipForm.css';

export default function InternshipForm() {
    const { register, handleSubmit } = useForm();
    const onSubmit = (data) => console.log(data);

    return (
        <div className="form-container">
            <img src={logoAI} alt="Department Logo" className="form-logo" />
            <h2 className="form-title">Apply for an Internship</h2>
            <form className="form-content" onSubmit={handleSubmit(onSubmit)}>
                <Input type="text" placeholder="Department *" name="department" register={register} required />
                <Input type="text" placeholder="Duration *" name="period_of_internship" register={register} required />
                <textarea
                    rows="4"
                    cols="50"
                    placeholder="Any additional notes (optional)"
                    className="form-textarea"
                    {...register('additional_notes')}
                />
                <div className="button-group">
                    <Button type="submit">Submit your application</Button>
                </div>
            </form>
        </div>
    );
}
