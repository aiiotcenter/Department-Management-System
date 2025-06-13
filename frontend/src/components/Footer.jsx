import FacebookIcon from '../assets/facebook.png';
import MailIcon from '../assets/mail.png';
import TwitterIcon from '../assets/twitter.png';
import './Footer.css';

function Footer() {
    return (
        <footer className="Footer">
            <div className="FooterColumn">
                <h4>Contact Us</h4>
                <ul>
                    <li>📞 +123 456 7890</li>
                    <li>📞 +987 654 3210</li>
                </ul>
            </div>
            <div className="FooterColumn">
                <h4>Socials</h4>
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
                <h4>Column 3</h4>
                <ul>
                    <li>Link 1</li>
                </ul>
            </div>
            <div className="FooterColumn">
                <h4>Address</h4>
                <ul>
                    <li>
                        <p>
                            📍 Near East University <br />
                            Near East Boulevard, ZIP: 99138 <br />
                            Nicosia / TRNC, Mersin 10 - Turkey
                        </p>
                    </li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;
