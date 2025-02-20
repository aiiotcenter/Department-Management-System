import React from 'react';
import '../styles/Internshipform.css';

const Internshipform = () => {
  return (
    <div className="Internshipform-container">
      <form className="Internshipform-box">
        <h2>Apply for Internship</h2>

        <label>Department</label>
        <select required>
          <option value="">Select a department</option>
          <option value="Mechanical Engineering">Mechanical Engineering</option>
          <option value="Electrical Engineering">Electrical Engineering</option>
          <option value="Civil Engineering">Civil Engineering</option>
          <option value="Computer Engineering">Computer Engineering</option>
          <option value="Chemical Engineering">Chemical Engineering</option>
        </select>

        <label>Period of Internship</label>
        <select required>
          <option value="">Select a period</option>
          <option value="Fall">Fall</option>
          <option value="Summer">Summer</option>
          <option value="Spring">Spring</option>
        </select>

        <label>Additional Notes</label>
        <textarea placeholder="Enter any additional notes"></textarea>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Internshipform;
