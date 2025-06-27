import { motion as Motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import aiImage from '../assets/AI.png';
import FlipCard from '../components/FlipCard';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Box from '../partials/HPSections';
import Projects from '../partials/Projects';
import './HomePage.css';

export default function HomePage() {
    const { t } = useTranslation();

    const slides = [
        {
            title: t('homepage.aboutSections.section1.title'),
            content: t('homepage.aboutSections.section1.content'),
        },
        {
            title: t('homepage.aboutSections.section2.title'),
            content: t('homepage.aboutSections.section2.content'),
        },
        {
            title: t('homepage.aboutSections.section3.title'),
            content: t('homepage.aboutSections.section3.content'),
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
                <FlipCard
                    title={t('homepage.appointments')}
                    content={t('homepage.flipCardContent.appointments')}
                    variant="appointments"
                    backContent={t('homepage.flipCardContent.appointments')}
                    linkTo="/appointment"
                />
                <FlipCard
                    title={t('homepage.internship')}
                    content={t('homepage.flipCardContent.internship')}
                    variant="internship"
                    backContent={t('homepage.flipCardContent.internship')}
                    linkTo="/internship"
                />
                <FlipCard
                    title={t('Announcements')}
                    content={t('Announcements')}
                    variant="requests"
                    backContent={t('view the latest announcements')}
                    linkTo="/announcements"
                />
            </div>

            <Motion.div
                ref={aboutRef}
                initial={{ opacity: 0, y: 100 }}
                animate={isAboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <Box title={t('homepage.about')} variant="about">
                    <div className="AboutContentCarousel" ref={carouselRef}>
                        {slides.map((slide, index) => (
                            <div className="AboutContentSlide" key={index}>
                                <h3>{slide.title}</h3>
                                <p>{slide.content}</p>
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
                <Box title={t('homepage.projects')} variant="projects">
                    <div className="ProjectsCarouselContainer">
                        <Projects />
                    </div>
                </Box>
            </Motion.div>

            <Footer />
        </div>
    );
}
