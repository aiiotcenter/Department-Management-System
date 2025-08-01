import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import logoAI from '../assets/logoAI.png';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../hooks/useAuth';
import { login } from '../services/auth';
import './LoginForm.css';

export default function LoginForm() {
    const { t } = useTranslation();
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const { updateAuthStatus, checkAuthStatus } = useAuth();

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.password);
            updateAuthStatus(true); // Set auth status to true after login

            // Check auth status to get user role and redirect accordingly
            setTimeout(async () => {
                await checkAuthStatus();
                const authResponse = await fetch('http://localhost:3001/api/check-auth', {
                    credentials: 'include',
                });
                const authData = await authResponse.json();

                if (authData.authenticated && authData.role) {
                    if (authData.role.toLowerCase() === 'student') {
                        navigate('/student-dashboard');
                    } else {
                        navigate('/admin-dashboard');
                    }
                } else {
                    navigate('/student-dashboard'); // fallback
                }
            }, 100);
        } catch (error) {
            alert(error.message || 'Login failed');
        }
    };

    return (
        <div className="form-container">
            <img src={logoAI} alt="Department Logo" className="form-logo" />
            <h2 className="form-title">{t('login.title')}</h2>
            <form className="form-content" onSubmit={handleSubmit(onSubmit)}>
                <Input type="text" placeholder={t('login.email')} name="email" register={register} />
                <Input type="password" placeholder={t('login.password')} name="password" register={register} />
                <div className="button-group">
                    <Button type="submit">{t('login.loginButton')}</Button>
                    <Button type="button" onClick={() => navigate('/signup')}>
                        {t('login.registerButton')}
                    </Button>
                </div>
            </form>
        </div>
    );
}
