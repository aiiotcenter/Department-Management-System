import { useTranslation } from 'react-i18next';
import FacebookIcon from '../assets/facebook.png';
import MailIcon from '../assets/mail.png';
import TwitterIcon from '../assets/twitter.png';
import './Footer.css';

function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="Footer">
            <div className="FooterColumn">
                <h4>{t('footer.contactUs')}</h4>
                <ul>
                    <li>📞 {t('footer.phoneNumbers.primary')}</li>
                    <li>📞 {t('footer.phoneNumbers.secondary')}</li>
                </ul>
            </div>
            <div className="FooterColumn">
                <h4>{t('footer.socials')}</h4>
                <ul>
                    <li style={{ marginTop: '10px' }}>
                        <img
                            src={FacebookIcon}
                            alt="Facebook"
                            style={{ width: '40px', marginRight: '8px', filter: 'brightness(0) invert(0))' }}
                        />
                    </li>
                    <li style={{ marginTop: '10px' }}>
                        <img
                            src={TwitterIcon}
                            alt="Twitter"
                            style={{ width: '40px', marginRight: '8px', filter: 'brightness(0) invert(0))' }}
                        />
                    </li>
                    <li style={{ marginTop: '10px' }}>
                        <img src={MailIcon} alt="Email" style={{ width: '40px', filter: 'brightness(0) invert(0))' }} />
                    </li>
                </ul>
            </div>
            <div className="FooterColumn">
                <h4>{t('footer.services')}</h4>
                <ul>
                    <li>{t('homepage.appointments')}</li>
                </ul>
            </div>
            <div className="FooterColumn">
                <h4>{t('footer.address.title')}</h4>
                <ul>
                    <li>
                        <p>
                            📍 {t('footer.address.line1')} <br />
                            {t('footer.address.line2')} <br />
                            {t('footer.address.line3')}
                        </p>
                    </li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;
