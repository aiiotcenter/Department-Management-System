import './Input.css';

export default function Input({ type = 'text', placeholder, register, name }) {
    return <input type={type} placeholder={placeholder} className="input-field" {...register(name)} />;
}
