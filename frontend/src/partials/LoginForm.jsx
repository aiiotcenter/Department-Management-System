import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import logoAI from '../assets/logoAI.png';
import Button from '../components/Button';
import Input from '../components/Input';
import './LoginForm.css';

export default function LoginForm() {
    const { t } = useTranslation();
    const { register, handleSubmit } = useForm();
    const onSubmit = (data) => console.log(data);

    return (
        <div className="form-container">
            <img src={logoAI} alt="Department Logo" className="form-logo" />
            <h2 className="form-title">{t('login.title')}</h2>
            <form className="form-content" onSubmit={handleSubmit(onSubmit)}>
                <Input type="text" placeholder={t('login.email')} name="email" register={register} />
                <Input type="password" placeholder={t('login.password')} name="password" register={register} />
                <div className="button-group">
                    <Button type="submit">{t('login.loginButton')}</Button>
                    <Button type="button">{t('login.registerButton')}</Button>
                </div>
            </form>
        </div>
    );
}
