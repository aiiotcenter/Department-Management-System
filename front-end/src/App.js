import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginSignup from './Login-Signup/page';
import SuperAdminDashboard from './superadmin/page';
import QRCodeManager from './QRCodeManager/page';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<LoginSignup />} />
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
          <Route path="/qrcode" element={<QRCodeManager />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
