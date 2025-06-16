import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import SignUpForm from '../partials/SignUpForm';
import './SignUpPage.css';

export default function SignUpPage() {
    return (
        <div className="signup-page-container">
            <Navbar />
            <main className="signup-main">
                <SignUpForm />
            </main>
            <Footer />
        </div>
    );
}
