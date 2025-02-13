import React from 'react';
import '../styles/RequestEntry.css'; 



const Requestentry = () => {
  return (
    <div className="request-entry-container">
      <form className="request-entry-box">
        <h2>Request Entry</h2>

        <label>Purpose of Entry</label>
        <textarea placeholder="State the reason for your entry request" required></textarea>

        <label>Date of Entry</label>
        <input type="date" required />

        <label>Time of Entry</label>
        <input type="time" required />

        <label>Person/Department to Visit</label>
        <input type="text" placeholder="Enter the name or department" required />

        <label>Additional Notes</label>
        <textarea placeholder="Enter any additional notes"></textarea>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Requestentry;
