import { useEffect, useRef, useState } from 'react';

import LanguageIcon from '../assets/Language.png';
import ListIcon from '../assets/List.png';
import logoAI from '../assets/logoAI.png';
import UserIcon from '../assets/user.png';
import './Navbar.css';

export default function Navbar() {
    const [openMenu, setOpenMenu] = useState(null);
    const navRef = useRef(null);
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

    return (
        <nav className="navbar" ref={navRef}>
            <img src={logoAI} alt="Department Logo" className="navbar-logo" />

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
                            <button onClick={() => setOpenMenu(null)}>English</button>
                            <button onClick={() => setOpenMenu(null)}>Turkish</button>
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
                            <a href="/login" onClick={() => setOpenMenu(null)}>
                                Login
                            </a>
                            <a href="/signup" onClick={() => setOpenMenu(null)}>
                                Sign Up
                            </a>
                            <a href="/profile" onClick={() => setOpenMenu(null)}>
                                Profile
                            </a>
                            <button onClick={() => setOpenMenu(null)}>Sign Out</button>
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
                            <a href="/dashboard" onClick={() => setOpenMenu(null)}>
                                Dashboard
                            </a>
                            <a href="/settings" onClick={() => setOpenMenu(null)}>
                                Settings
                            </a>
                            <a href="/help" onClick={() => setOpenMenu(null)}>
                                Help
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
