import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignUpForm';

function App() {
  const [showLogin, setShowLogin] = useState(true);

  const handleToggle = () => {
    setShowLogin(prev => !prev);
  };

  return (
    <div>
      {showLogin ? <LoginForm /> : <SignupForm />}

      <button onClick={handleToggle} style={{ marginTop: 20 }}>
        Switch to {showLogin ? 'Signup' : 'Login'}
      </button>
    </div>
  );
}

export default App;
