import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import  LoginSignup  from './Login-Signup/page.jsx';
import Mainpage from './components/Mainpage/Mainpage.jsx';

console.log("LoginSignup:", LoginSignup);
console.log("Mainpage:", Mainpage);

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/Mainpage" element={<Mainpage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
