import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginSignup.css';

import user_icon from '../assets/person.png';
import email_icon from '../assets/email.png';
import password_icon from '../assets/password.png';
import student_icon from '../assets/security.png';

const LoginSignup = () => {
  const [action, setAction] = useState("Sign Up");
  const navigate = useNavigate();

  const toggleAction = () => {
    setAction(action === "Sign Up" ? "Login" : "Sign Up");
  };

  const handleSubmit = () => {
    navigate('/Mainpage');
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="Underline"></div>
      </div>
      <div className="inputs">
        {action === "Login" ? null : (
          <div className="input">
            <img src={user_icon} alt='' />
            <input type="text" placeholder='Name' />
          </div>
        )}
        {action === "Login" ? null : (
          <div className="input">
            <img src={email_icon} alt='' />
            <input type="email" placeholder='Email' />
          </div>
        )}
        <div className="input">
          <img src={student_icon} alt='' />
          <input type="text" placeholder='Student ID' />
        </div>
        <div className="input">
          <img src={password_icon} alt='' />
          <input type="password" placeholder='Password' />
        </div>
      </div>

      {action === "Sign Up" ? null : (
        <div className="forgot-password"> Forgot Password? <span>Click here!</span></div>
      )}
      {action === "Sign Up" ? null : (
        <div className="Donthave-account"> Don't have an Account? <span onClick={toggleAction}>Click here!</span></div>
      )}
      {action === "Login" ? null : (
        <div className="Already-account"> Already have an Account? <span onClick={toggleAction}>Click here!</span></div>
      )}

      <div className='submit-container'>
        <div className="submit" onClick={handleSubmit}>{action}</div>
      </div>
    </div>
  );
};

export default LoginSignup; 
