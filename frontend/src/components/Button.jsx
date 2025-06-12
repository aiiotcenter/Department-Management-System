import './Button.css';

export default function Button({ type = 'button', children, onClick }) {
    return (
        <button type={type} className="form-button" onClick={onClick}>
            {children}
        </button>
    );
}
