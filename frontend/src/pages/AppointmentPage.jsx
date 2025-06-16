import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import AppointmentForm from '../partials/AppointmentForm';

import './AppointmentPage.css';

function AppointmentPage() {
    return (
        <div className="appointment-page-container">
            <Navbar />
            <main className="appointment-main">
                <div className="appointment-content">
                    <div className="left-content">
                        <h2>Apply for an Appointment</h2>
                        <p>
                            Use this form to submit your appointment request to our department. Please provide the
                            following information:
                        </p>
                        <ul>
                            <li>Purpose of your visit – What is the meeting about?</li>
                            <li> Preferred date and time – When would you like to schedule it?</li>
                            <li> Additional notes (optional) – Any other information you'd like to share?</li>
                        </ul>
                        <p>
                            Once submitted, your appointment request will be reviewed by our team. You'll receive
                            updates on the status of your request.
                        </p>
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
