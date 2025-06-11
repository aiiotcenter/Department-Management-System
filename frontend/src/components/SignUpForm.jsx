import React from 'react';
import './SignUpForm.css';
import logoAI from '../assets/logoAI.png'; // adjust path if needed

const SignUpForm = () => {
    return (
      <div className="form-container">
        <img src={logoAI} alt="Department Logo" className="form-logo" />
        <h2 className="form-title">Create a new account</h2>
        <form className="form-content">
          <div className="name-group">
            <input
              type="text"
              placeholder="First Name"
              className="input-field"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="input-field"
            />
          </div>
  
          <input
            type="email"
            placeholder="Email Address"
            className="input-field"
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            className="input-field"
          />
  
          <div className="button-group">
            <button type="submit" className="form-button">Sign Up</button>
            <button type="button" className="form-button">Back to Login</button>
          </div>
        </form>
      </div>
    );
  };
  
  export default SignUpForm;