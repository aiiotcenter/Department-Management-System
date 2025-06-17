import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function EmployeeManagement() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });
    const { register, handleSubmit, reset } = useForm();

    // Mock data with state that can be modified
    const [employees, setEmployees] = useState([
        {
            _id: '1',
            name: 'Dr. Robert Johnson',
            email: 'robert.johnson@university.edu',
            role: 'professor',
        },
        {
            _id: '2',
            name: 'Jennifer Smith',
            email: 'jennifer.smith@university.edu',
            role: 'assistant',
        },
        {
            _id: '3',
            name: 'Michael Davis',
            email: 'michael.davis@university.edu',
            role: 'professor',
        },
        {
            _id: '4',
            name: 'Lisa Wilson',
            email: 'lisa.wilson@university.edu',
            role: 'secretary',
        },
        {
            _id: '5',
            name: 'Admin User',
            email: 'admin@university.edu',
            role: 'admin',
        },
    ]);

    // Function to add a new employee
    const onSubmit = (data) => {
        // Create a new employee with the form data
        const newEmployee = {
            _id: (employees.length + 1).toString(), // Simple ID generation
            name: data.name,
            email: data.email,
            role: data.role,
        };

        // Add the new employee to the state
        setEmployees([...employees, newEmployee]);

        // Show notification
        setNotification({
            show: true,
            type: 'success',
            message: 'Employee added successfully (Mock)',
        });

        // Close the form and reset fields
        setShowAddForm(false);
        reset();
    };

    // Function to delete an employee
    const handleDelete = (id) => {
        if (!window.confirm('Are you sure you want to delete this employee?')) return;

        // Remove the employee from the state
        setEmployees(employees.filter((employee) => employee._id !== id));

        // Show notification
        setNotification({
            show: true,
            type: 'success',
            message: 'Employee deleted successfully (Mock)',
        });
    };

    // Create a simple form without using custom components to avoid blank page issues
    const renderAddForm = () => {
        return (
            <div className="form-container" style={{ marginBottom: '20px' }}>
                <h3>Add New Employee</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="form-content">
                    <div className="input-group">
                        <label>Full Name *</label>
                        <input
                            type="text"
                            className="form-textarea"
                            placeholder="Full Name"
                            {...register('name', { required: true })}
                        />
                    </div>

                    <div className="input-group">
                        <label>Email *</label>
                        <input
                            type="email"
                            className="form-textarea"
                            placeholder="Email"
                            {...register('email', { required: true })}
                        />
                    </div>

                    <div className="input-group">
                        <label>Password *</label>
                        <input
                            type="password"
                            className="form-textarea"
                            placeholder="Password"
                            {...register('password', { required: true })}
                        />
                    </div>

                    <div className="input-group">
                        <label>Role:</label>
                        <select {...register('role', { required: true })} className="form-textarea">
                            <option value="professor">Professor</option>
                            <option value="assistant">Assistant</option>
                            <option value="secretary">Secretary</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="button-group">
                        <button type="submit" className="action-button approve-button">
                            Add Employee
                        </button>
                        <button type="button" className="action-button" onClick={() => setShowAddForm(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    return (
        <div>
            <h2 className="form-title">Employee Management</h2>

            {notification.show && <div className={`notification ${notification.type}`}>{notification.message}</div>}

            <div className="admin-panel">
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                    }}
                >
                    <h3>Employees</h3>
                    <button className="action-button approve-button" onClick={() => setShowAddForm(!showAddForm)}>
                        {showAddForm ? 'Cancel' : 'Add New Employee'}
                    </button>
                </div>

                {showAddForm && renderAddForm()}

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee._id}>
                                <td>{employee.name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.role}</td>
                                <td>
                                    <button
                                        className="action-button reject-button"
                                        onClick={() => handleDelete(employee._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
