import React from 'react';
import './LoginForm.css';
import logoAI from '../assets/logoAI.png'; // adjust path if needed

const LoginForm = () => {
  return (
    <div className="form-container">
      <img src={logoAI} alt="Department Logo" className="form-logo" />
      <h2 className="form-title">Login to your account</h2>
      <form className="form-content">
        <input
          type="text"
          placeholder="University ID"
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          className="input-field"
        />
        <div className="button-group">
            <button type="submit" className="form-button">Login</button>
            <button type="button" className="form-button">New ? Register</button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
