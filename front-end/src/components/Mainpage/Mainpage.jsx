import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Mainpage.css';
import coverImage from '../../assets/cover1.jpg'; 

const Mainpage = () => {
  const navigate = useNavigate();

  return (
    <div className="main-page">
      <img src={coverImage} alt="Cover" className="cover-image" />  

      <div className="content">
        <h1>Welcome to the Department</h1>
        <p>Select an option to proceed:</p>
        <div className="options">
          <button className="option-button" onClick={() => navigate('/apply-appointment')}>
            Apply for Appointment
          </button>
          <button className="option-button" onClick={() => navigate('/request-entry')}>
            Request Entry
          </button>
          <button className="option-button" onClick={() => navigate('/apply-internship')}>
            Apply for Internship
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mainpage;
