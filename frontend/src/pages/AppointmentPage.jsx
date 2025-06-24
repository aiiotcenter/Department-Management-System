import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import AppointmentForm from '../partials/AppointmentForm';

import './AppointmentPage.css';

function AppointmentPage() {
    const { t } = useTranslation();
    return (
        <div className="appointment-page-container">
            <Navbar />
            <main className="appointment-main">
                <div className="appointment-content">
                    <div className="left-content">
                        <h2>{t('appointment.pageTitle')}</h2>
                        <p>{t('appointment.pageDesc1')}</p>
                        <ul>
                            <li>{t('appointment.purpose')}</li>
                            <li>{t('appointment.dateTime')}</li>
                            <li>{t('appointment.notes')}</li>
                        </ul>
                        <p>{t('appointment.pageDesc2')}</p>
                    </div>
                    <div className="right-content">
                        <AppointmentForm />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default AppointmentPage;
