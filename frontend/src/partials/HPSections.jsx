import './HPSections.css';

export default function Box({ title, content, variant, children }) {
    return (
        <div className={`Box ${variant ? variant : ''}`}>
            {title && <h3>{title}</h3>}
            {content && <p>{content}</p>}
            {children && <div className="BoxChildren">{children}</div>}
        </div>
    );
}
