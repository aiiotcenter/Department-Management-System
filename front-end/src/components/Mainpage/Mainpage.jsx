import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Mainpage.css';
import coverImage from '../../assets/cover1.jpg'; 

const Mainpage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch user data when the component loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Unauthorized! Please log in.');
          navigate('/login');
          return;
        }

        // Make the request to the homepage API with token
        const response = await axios.get('http://localhost:3000/api/homepage', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser(response.data.user); // Store user data
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          console.error('Error fetching user data:', error);
          alert('An error occurred. Please try again later.');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear JWT token
    navigate('/login'); // Redirect to login
  };

  return (
    <div className="main-page">
      <img src={coverImage} alt="Cover" className="cover-image" />  

      <div className="content">
        <h1>Welcome to the Department</h1>
        {user ? (
          <h2>Hello, {user.User_name}!</h2>
        ) : (
          <p>Loading user data...</p>
        )}
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
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Mainpage;
