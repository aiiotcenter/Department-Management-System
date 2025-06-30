import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import logoAI from '../assets/logoAI.png';
import Button from '../components/Button';
import Input from '../components/Input';
import './SignUpForm.css';

export default function SignUpForm() {
    const { t } = useTranslation();
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        let photo_path = '';
        if (data.photo && data.photo.length > 0) {
            // Only uses file name and doesn't store picture.
            photo_path = data.photo[0].name;
        }
        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: `${data.firstName} ${data.lastName}`,
                    email: data.email,
                    password: data.password,
                    photo_path,
                }),
            });
            const result = await response.json();
            if (response.ok) {
                alert('Registration successful! Please log in.');
                navigate('/login');
            } else {
                alert(result.message || 'Registration failed');
            }
        } catch (error) {
            alert('An unexpected error occurred: ' + error.message);
        }
    };

    return (
        <div className="form-container">
            <img src={logoAI} alt="Department Logo" className="form-logo" />
            <h2 className="form-title">{t('signup.title')}</h2>
            <form className="form-content" onSubmit={handleSubmit(onSubmit)}>
                <div className="name-group">
                    <Input type="text" placeholder={t('signup.firstName')} name="firstName" register={register} />
                    <Input type="text" placeholder={t('signup.lastName')} name="lastName" register={register} />
                </div>

                <Input type="email" placeholder={t('signup.email')} name="email" register={register} />
                <Input type="password" placeholder={t('signup.password')} name="password" register={register} />
                <Input
                    type="password"
                    placeholder={t('signup.confirmPassword')}
                    name="confirmPassword"
                    register={register}
                />
                <Input type="file" name="photo" register={register} accept="image/*" />

                <div className="button-group">
                    <Button type="submit">{t('signup.signupButton')}</Button>
                    <Button type="button" onClick={() => navigate('/login')}>
                        {t('signup.loginButton')}
                    </Button>
                </div>
            </form>
        </div>
    );
}
