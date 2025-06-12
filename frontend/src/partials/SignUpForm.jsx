import { useForm } from 'react-hook-form';

import logoAI from '../assets/logoAI.png';
import Button from '../components/Button';
import Input from '../components/Input';
import './SignUpForm.css';

export default function SignUpForm() {
    const { register, handleSubmit } = useForm();
    const onSubmit = (data) => console.log(data);

    return (
        <div className="form-container">
            <img src={logoAI} alt="Department Logo" className="form-logo" />
            <h2 className="form-title">Create a new account</h2>
            <form className="form-content" onSubmit={handleSubmit(onSubmit)}>
                <div className="name-group">
                    <Input type="text" placeholder="First Name" name="firstName" register={register} />
                    <Input type="text" placeholder="Last Name" name="lastName" register={register} />
                </div>

                <Input type="email" placeholder="Email Address" name="email" register={register} />
                <Input type="password" placeholder="Password" name="password" register={register} />
                <Input type="password" placeholder="Confirm Password" name="confirmPassword" register={register} />

                <div className="button-group">
                    <Button type="submit">Sign Up</Button>
                    <Button type="button">Back to Login</Button>
                </div>
            </form>
        </div>
    );
}
