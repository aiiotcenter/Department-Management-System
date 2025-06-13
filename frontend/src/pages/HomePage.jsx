import { useRef, useState } from 'react';
import aiImage from '../assets/AI.png';
import AIApplication from '../assets/AIApplication.png';
import AIBuilding from '../assets/AIBuilding.png';
import AIMeeting from '../assets/AIMeeting.png';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Box from '../partials/HPSections';
import './HomePage.css';

export default function HomePage() {
    const slides = [
        {
            title: 'About Section 1',
            content: ``,
            images: [AIApplication, AIBuilding, AIMeeting],
        },
        {
            title: 'About Section 2',
            content: ``,
            images: [AIApplication, AIBuilding, AIMeeting],
        },
        {
            title: 'About Section 3',
            content: ``,
            images: [AIApplication, AIBuilding, AIMeeting],
        },
    ];

    const carouselRef = useRef(null);
    const [activeSlide, setActiveSlide] = useState(0);

    const scrollToSlide = (index) => {
        const slideWidth = carouselRef.current.clientWidth;
        carouselRef.current.scrollTo({
            left: index * slideWidth,
            behavior: 'smooth',
        });
        setActiveSlide(index);
    };

    const handlePrev = () => {
        if (activeSlide > 0) {
            scrollToSlide(activeSlide - 1);
        }
    };

    const [zoomedImage, setZoomedImage] = useState(null);

    const handleImageClick = (index) => {
        setZoomedImage((prev) => (prev === index ? null : index));
    };

    const handleNext = () => {
        if (activeSlide < slides.length - 1) {
            scrollToSlide(activeSlide + 1);
        }
    };

    return (
        <div className="Homepage">
            <Navbar />

            <div className="Hero" style={{ backgroundImage: `url(${aiImage})` }}>
            </div>

            <div className="BoxesContainer">
                <Box title="Appointments" content="..." variant="appointments" />
                <Box title="Internship" content="..." variant="internship" />
                <Box title="Requests" content="..." variant="requests" />
            </div>

            <Box title="About" variant="about">
                <div className="AboutContentCarousel" ref={carouselRef}>
                    {slides.map((slide, index) => (
                        <div className="AboutContentSlide" key={index}>
                            <p>{slide.content}</p>
                            <div className="AboutImages">
                                {slide.images.map((imgSrc, imgIndex) => (
                                    <img
                                        src={imgSrc}
                                        alt={`Slide ${index + 1} img ${imgIndex + 1}`}
                                        key={imgIndex}
                                        onClick={() => handleImageClick(`${index}-${imgIndex}`)}
                                        onMouseLeave={() => setZoomedImage(null)}
                                        className={zoomedImage === `${index}-${imgIndex}` ? 'zoomed' : ''}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="CarouselControls">
                    <button className="ArrowButton" onClick={handlePrev} disabled={activeSlide === 0}>
                        &lt;
                    </button>

                    <div className="CarouselDots">
                        {slides.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${index === activeSlide ? 'active' : ''}`}
                                onClick={() => scrollToSlide(index)}
                            ></span>
                        ))}
                    </div>

                    <button className="ArrowButton" onClick={handleNext} disabled={activeSlide === slides.length - 1}>
                        &gt;
                    </button>
                </div>
            </Box>

            <Footer />
        </div>
    );
}
