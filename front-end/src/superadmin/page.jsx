import React, { useState } from "react";
import "../styles/superadmin.css";

const SuperAdminDashboard = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeePassword, setEmployeePassword] = useState("");
  const [employeeRole, setEmployeeRole] = useState(""); // Stored but not displayed
  const [profilePic, setProfilePic] = useState(null);

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    const newEmployee = {
      id: employees.length + 1,
      name: employeeName,
      email: employeeEmail,
      password: employeePassword,
      role: employeeRole, // Role stored but not displayed
    };
    setEmployees([...employees, newEmployee]);
    setEmployeeName("");
    setEmployeeEmail("");
    setEmployeePassword("");
    setEmployeeRole("");
    setShowAddForm(false);
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="profile-section">
          <label htmlFor="profile-upload">
            <img
              src={profilePic || "/default-profile.png"}
              alt="Profile"
              className="profile-pic"
            />
          </label>
          <input
            type="file"
            id="profile-upload"
            accept="image/*"
            onChange={handleProfilePicChange}
            hidden
          />
          <h1>Super Admin Dashboard</h1>
        </div>
      </header>

      {/* Employee Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>
                  {/* Actions can be added later */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Employee Button */}
      <button className="add-employee-btn" onClick={toggleAddForm}>
        Add Employee
      </button>

      {/* Add Employee Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Employee</h3>
            <form onSubmit={handleAddEmployee} className="employee-form">
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
                type="password"
                placeholder="Password"
                value={employeePassword}
                onChange={(e) => setEmployeePassword(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Role (Not Displayed)"
                value={employeeRole}
                onChange={(e) => setEmployeeRole(e.target.value)}
              />
              <button type="submit" className="submit-btn">Add Employee</button>
              <button type="button" className="close-btn" onClick={toggleAddForm}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
