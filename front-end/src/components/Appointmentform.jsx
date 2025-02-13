import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Appointmentform.css';

const Appointmentform = () => {
  const [formData, setFormData] = useState({
    appointment_approver_id: '',
    visit_purpose: '',
    visit_date: '',
    visit_time: ''
  });

  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/appointment', formData, {
        headers: {
          'Content-Type': 'application/json',
          // Include authorization token if needed
          // 'Authorization': `Bearer ${yourAuthToken}`
        }
      });

      setResponseMessage(response.data.message);
    } catch (error) {
      console.error('Error creating appointment:', error);
      setResponseMessage('Error creating appointment. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <form className="appointment-form" onSubmit={handleSubmit}>
        <h2 className="form-heading">Apply for Appointment</h2>

        <div className="form-grid">
          <div className="form-field form-full">
            <label className="form-label">Select Employee</label>
            <select
              className="form-input"
              name="appointment_approver_id"
              value={formData.appointment_approver_id}
              onChange={handleChange}
              required
            >
              <option value="">Select an employee</option>
              <option value="Ifediatu Mary">Ifediatu Mary</option>
              <option value="Dr Fredrick">Dr Fredrick</option>
              <option value="Willam Marthr">William Marthr</option>
              <option value="Clara David">Clara David</option>
            </select>
          </div>

          <div className="form-field form-full">
            <label className="form-label">Reason for Appointment</label>
            <select
              className="form-input"
              name="visit_purpose"
              value={formData.visit_purpose}
              onChange={handleChange}
              required
            >
              <option value="">Select a reason</option>
              <option value="Academic Advising">Academic Advising</option>
              <option value="Course Registration">Course Registration</option>
              <option value="Financial Aid Inquiry">Financial Aid Inquiry</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-field form-full">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              name="visit_date"
              value={formData.visit_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field form-full">
            <label className="form-label">Time</label>
            <input
              type="time"
              className="form-input"
              name="visit_time"
              value={formData.visit_time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
      {responseMessage && <p className="response-message">{responseMessage}</p>}
    </div>
  );
};

export default Appointmentform;
