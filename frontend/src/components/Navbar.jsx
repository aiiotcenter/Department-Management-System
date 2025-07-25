import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import LanguageIcon from '../assets/Language.png';
import ListIcon from '../assets/List.png';
import logoAI from '../assets/logoAI.png';
import UserIcon from '../assets/user.png';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../services/auth';
import './Navbar.css';

export default function Navbar() {
    const [openMenu, setOpenMenu] = useState(null);
    const navRef = useRef(null);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated, user, updateAuthStatus } = useAuth();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setOpenMenu(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMenu = (menu) => {
        setOpenMenu((prev) => (prev === menu ? null : menu));
    };

    const handleLogout = async () => {
        try {
            await logout();
            updateAuthStatus(false);
            setOpenMenu(null);
            navigate('/login');
        } catch {
            alert('Logout failed.');
        }
    };

    return (
        <nav className="navbar" ref={navRef}>
            <Link to="/">
                <img src={logoAI} alt="Department Logo" className="navbar-logo" />
            </Link>

            <div className="navbar-icons">
                {/* Language icon */}
                <div
                    className="navbar-icon lang-icon"
                    onClick={() => toggleMenu('lang')}
                    aria-label="Toggle language menu"
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') toggleMenu('lang');
                    }}
                >
                    <img src={LanguageIcon} alt="Language" className="icon-image" />
                    {openMenu === 'lang' && (
                        <div className="menu-options lang-menu">
                            <button onClick={() => changeLanguage('en')}>{t('languages.english')}</button>
                            <button onClick={() => changeLanguage('tr')}>{t('languages.turkish')}</button>
                        </div>
                    )}
                </div>

                {/* User icon */}
                <div
                    className="navbar-icon user-icon"
                    onClick={() => toggleMenu('user')}
                    aria-label="Toggle user menu"
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') toggleMenu('user');
                    }}
                >
                    <img src={UserIcon} alt="User" className="icon-image" />
                    {openMenu === 'user' && (
                        <div className="menu-options user-menu">
                            {!isAuthenticated ? (
                                <>
                                    <Link to="/login" onClick={() => setOpenMenu(null)}>
                                        {t('navbar.login')}
                                    </Link>
                                    <Link to="/signup" onClick={() => setOpenMenu(null)}>
                                        {t('navbar.signup')}
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/profile" onClick={() => setOpenMenu(null)}>
                                        {t('navbar.profile')}
                                    </Link>
                                    <button onClick={handleLogout}>{t('navbar.signout')}</button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Hamburger icon */}
                <div
                    className="navbar-icon hamburger"
                    onClick={() => toggleMenu('hamburger')}
                    aria-label="Toggle main menu"
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') toggleMenu('hamburger');
                    }}
                >
                    <img src={ListIcon} alt="Menu" className="icon-image" />
                    {openMenu === 'hamburger' && (
                        <div className="menu-options hamburger-menu">
                            {isAuthenticated &&
                                user &&
                                (user.role?.toLowerCase() === 'student' ? (
                                    <Link to="/student-dashboard" onClick={() => setOpenMenu(null)}>
                                        {t('navbar.studentDashboard')}
                                    </Link>
                                ) : (
                                    <Link to="/admin-dashboard" onClick={() => setOpenMenu(null)}>
                                        {t('navbar.adminDashboard')}
                                    </Link>
                                ))}
                            <button onClick={() => setOpenMenu(null)}>{t('navbar.help')}</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
