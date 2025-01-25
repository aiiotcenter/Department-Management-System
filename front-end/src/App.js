import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginSignup from './Login-Signup/page';
import SuperAdminDashboard from './superadmin/page';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<LoginSignup />} />
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
