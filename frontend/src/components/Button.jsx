import './Button.css';

export default function Button({ type = 'button', children, onClick, variant }) {
    return (
        <button type={type} className={`form-button ${variant ? `form-button-${variant}` : ''}`} onClick={onClick}>
            {children}
        </button>
    );
}
