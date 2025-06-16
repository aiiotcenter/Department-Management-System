import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import InternshipForm from '../partials/InternshipForm';
import './InternshipPage.css';

export default function InternshipPage() {
    return (
        <div className="internship-page-container">
            <Navbar />
            <main className="internship-main">
                <div className="internship-content">
                    <div className="left-content">
                        <h2>Apply for an Internship</h2>
                        <p>Use this form to submit your internship application to our department.</p>
                        <p>Please provide the following information:</p>
                        <ul>
                            <li>The department you wish to intern with</li>
                            <li>Your preferred internship duration</li>
                            <li>Any additional information to support your application</li>
                        </ul>
                        <p>
                            Once submitted, your application will be reviewed by our team. You'll receive updates on the
                            status of your application.
                        </p>
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
