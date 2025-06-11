import React from 'react';
import Navbar from '../components/Navbar';
import LoginForm from '../components/LoginForm';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page-container">
      <Navbar />
      <main className="login-main">
        <LoginForm />
      </main>
    </div>
  );
};

export default LoginPage;
