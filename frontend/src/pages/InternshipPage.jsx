import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import InternshipForm from '../partials/InternshipForm';
import './InternshipPage.css';

export default function InternshipPage() {
    const { t } = useTranslation();
    return (
        <div className="internship-page-container">
            <Navbar />
            <main className="internship-main">
                <div className="internship-content">
                    <div className="left-content">
                        <h2>{t('internship.pageTitle')}</h2>
                        <p>{t('internship.pageDesc1')}</p>
                        <p>{t('internship.pageDesc2')}</p>
                        <ul>
                            <li>{t('internship.university')}</li>
                            <li>{t('internship.department')}</li>
                            <li>{t('internship.duration')}</li>
                            <li>{t('internship.additional')}</li>
                            <li>{t('internship.cv')}</li>
                        </ul>
                        <p>{t('internship.pageDesc3')}</p>
                    </div>
                    <div className="right-content">
                        <InternshipForm />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
