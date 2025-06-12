import { useForm } from 'react-hook-form';

import logoAI from '../assets/logoAI.png';
import Button from '../components/Button';
import Input from '../components/Input';
import './LoginForm.css';

export default function LoginForm() {
    const { register, handleSubmit } = useForm();
    const onSubmit = (data) => console.log(data);

    return (
        <div className="form-container">
            <img src={logoAI} alt="Department Logo" className="form-logo" />
            <h2 className="form-title">Login to your account</h2>
            <form className="form-content" onSubmit={handleSubmit(onSubmit)}>
                <Input type="text" placeholder="Email" name="email" register={register} />
                <Input type="password" placeholder="Password" name="password" register={register} />
                <div className="button-group">
                    <Button type="submit">Login</Button>
                    <Button type="button">New? Register</Button>
                </div>
            </form>
        </div>
    );
}
