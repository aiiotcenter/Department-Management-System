import React from 'react';
import Navbar from '../components/Navbar';
import SignUpForm from '../components/SignUpForm';
import './SignUpPage.css';

const SignUpPage = () => {
  return (
    <div className="signup-page-container">
      <Navbar />
      <main className="signup-main">
        <SignUpForm />
      </main>
    </div>
  );
};

export default SignUpPage;
