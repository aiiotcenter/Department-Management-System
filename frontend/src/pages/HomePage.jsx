import { motion as Motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import aiImage from '../assets/AI.png';
import AIApplication from '../assets/AIApplication.png';
import AIBuilding from '../assets/AIBuilding.png';
import AIMeeting from '../assets/AIMeeting.png';
import FlipCard from '../components/FlipCard';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Box from '../partials/HPSections';
import Projects from '../partials/Projects';
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
    const aboutRef = useRef(null);
    const projectsRef = useRef(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const isAboutInView = useInView(aboutRef, { threshold: 0.1 });
    const isProjectsInView = useInView(projectsRef, { threshold: 0.1 });

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

            <div className="Hero" style={{ backgroundImage: `url(${aiImage})` }}></div>

            <div className="BoxesContainer">
                <FlipCard title="Appointments" content="..." variant="appointments" backContent="To be filled later" />
                <FlipCard title="Internship" content="..." variant="internship" backContent="To be filled later" />
                <FlipCard title="Requests" content="..." variant="requests" backContent="To be filled later" />
            </div>

            <Motion.div
                ref={aboutRef}
                initial={{ opacity: 0, y: 100 }}
                animate={isAboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
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

                        <button
                            className="ArrowButton"
                            onClick={handleNext}
                            disabled={activeSlide === slides.length - 1}
                        >
                            &gt;
                        </button>
                    </div>
                </Box>
            </Motion.div>

            <Motion.div
                ref={projectsRef}
                initial={{ opacity: 0, y: 100 }}
                animate={isProjectsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <Box title="Projects" variant="projects">
                    <div className="ProjectsCarouselContainer">
                        <Projects />
                    </div>
                </Box>
            </Motion.div>

            <Footer />
        </div>
    );
}
