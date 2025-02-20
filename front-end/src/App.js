import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import  LoginSignup  from './Login-Signup/page.jsx';
import Mainpage from './components/Mainpage/Mainpage.jsx';
import Appointmentform from './components/Appointmentform';
import Internshipform from './components/Internshipform';
import Requestentryform from './components/Requestentryform';


console.log("LoginSignup:", LoginSignup);
console.log("Mainpage:", Mainpage);
console.log(Internshipform);
console.log(Requestentryform);

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/Mainpage" element={<Mainpage />} />
          <Route path="/apply-appointment" element={<Appointmentform />} />
          <Route path="/apply-internship" element={<Internshipform />} />
          <Route path="/request-entry" element={<Requestentryform />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
