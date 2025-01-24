import React, { useState } from "react";
import "../styles/superadmin.css";

const SuperAdminDashboard = () => {
  // State for managing the visibility of the add employee form
  const [showAddForm, setShowAddForm] = useState(false);

  // State for managing employee data
  const [employees, setEmployees] = useState([]);
  
  // State for managing form inputs
  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");

  // Handle form visibility toggle
  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  // Handle form submission to add a new employee
  const handleAddEmployee = (e) => {
    e.preventDefault();
    const newEmployee = {
      id: employees.length + 1, // Simple ID generation based on length
      name: employeeName,
      email: employeeEmail,
      role: employeeRole
    };
    setEmployees([...employees, newEmployee]);
    setEmployeeName("");
    setEmployeeEmail("");
    setEmployeeRole("");
    setShowAddForm(false); // Hide the form after submission
  };

  return (
    <div className="container">
      <h1>Super Admin Dashboard</h1>

      {/* Add Employee Form */}
      {showAddForm && (
        <form id="add-employee-form" onSubmit={handleAddEmployee}>
          <h3>Add Employee</h3>
          <input
            type="text"
            id="employee-name"
            placeholder="Employee Name"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            required
          />
          <input
            type="email"
            id="employee-email"
            placeholder="Employee Email"
            value={employeeEmail}
            onChange={(e) => setEmployeeEmail(e.target.value)}
            required
          />
          <input
            type="text"
            id="employee-role"
            placeholder="Employee Role"
            value={employeeRole}
            onChange={(e) => setEmployeeRole(e.target.value)}
            required
          />
          <button type="submit" className="add-btn">Add Employee</button>
        </form>
      )}

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
                {/* Add any action buttons like Edit or Delete here */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        id="toggle-add-form"
        className="add-btn"
        onClick={toggleAddForm}
      >
        Add New Employee
      </button>
    </div>
  );
};

export default SuperAdminDashboard;
