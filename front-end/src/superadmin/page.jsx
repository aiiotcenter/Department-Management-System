import React, { useState } from "react";
import "../styles/superadmin.css";

const SuperAdminDashboard = () => {
  // State for managing modal visibility
  const [showModal, setShowModal] = useState(false);

  // Employee state
  const [employees, setEmployees] = useState([]);

  // Form state
  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");
  const [employeePassword, setEmployeePassword] = useState("");

  // Toggle modal visibility
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // Handle form submission
  const handleAddEmployee = (e) => {
    e.preventDefault();
    const newEmployee = {
      id: employees.length + 1,
      name: employeeName,
      email: employeeEmail,
      role: employeeRole,
      password: employeePassword, // Store password (hashed in real-world cases)
    };

    setEmployees([...employees, newEmployee]);
    
    // Clear fields
    setEmployeeName("");
    setEmployeeEmail("");
    setEmployeeRole("");
    setEmployeePassword("");

    // Close modal
    setShowModal(false);
  };

  return (
    <div className="dashboard-container">
      
      {/* Header Section */}
      <div className="dashboard-header">
        <h1>Super Admin Dashboard</h1>
        <div className="profile-container">
          <div className="profile-pic">👤</div>
        </div>
      </div>

      {/* Add Employee Button */}
      <button className="add-btn" onClick={toggleModal}>Add Employee</button>

      {/* Employee Table */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.role}</td>
              <td>
                <button className="delete-btn" onClick={() => {
                  setEmployees(employees.filter(emp => emp.id !== employee.id));
                }}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Popup */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Employee</h3>
            <form className="modal-form" onSubmit={handleAddEmployee}>
              <input
                type="text"
                placeholder="Employee Name"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Employee Email"
                value={employeeEmail}
                onChange={(e) => setEmployeeEmail(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Employee Role"
                value={employeeRole}
                onChange={(e) => setEmployeeRole(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Employee Password"
                value={employeePassword}
                onChange={(e) => setEmployeePassword(e.target.value)}
                required
              />
              <button type="submit" className="submit-btn">Add Employee</button>
              <button type="button" className="close-btn" onClick={toggleModal}>Close</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SuperAdminDashboard;
