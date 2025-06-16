import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import LoginForm from '../partials/LoginForm';
import './LoginPage.css';

export default function LoginPage() {
    return (
        <div className="login-page-container">
            <Navbar />
            <main className="login-main">
                <LoginForm />
            </main>
            <Footer />
        </div>
    );
}
