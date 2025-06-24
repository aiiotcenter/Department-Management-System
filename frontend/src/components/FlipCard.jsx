import { motion as Motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './FlipCard.css';

export default function FlipCard({ title, variant, backContent = '', linkTo = '' }) {
    const [isFlipped, setIsFlipped] = useState(false);

    const CardContent = () => (
        <Motion.div
            className="flip-card"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{ transformStyle: 'preserve-3d' }}
        >
            {/* Front Face */}
            <div className={`flip-card-face flip-card-front ${variant ? variant : ''}`}>
                {title && <h3>{title}</h3>}
            </div>

            {/* Back Face */}
            <div className={`flip-card-face flip-card-back ${variant ? variant : ''}`}>
                <h3>{title}</h3>
                <p>{backContent}</p>
            </div>
        </Motion.div>
    );

    if (linkTo) {
        return (
            <Link
                to={linkTo}
                className={`flip-card-container ${variant ? variant : ''}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
                onMouseEnter={() => setIsFlipped(true)}
                onMouseLeave={() => setIsFlipped(false)}
            >
                <CardContent />
            </Link>
        );
    }

    return (
        <div
            className={`flip-card-container ${variant ? variant : ''}`}
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <CardContent />
        </div>
    );
}
