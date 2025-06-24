import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export default function EmployeeManagement() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });
    const { register, handleSubmit, reset } = useForm();
    const { t } = useTranslation();

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
            message: t('adminDashboard.notifications.employeeAdded'),
        });

        // Close the form and reset fields
        setShowAddForm(false);
        reset();
    };

    // Function to delete an employee
    const handleDelete = (id) => {
        if (!window.confirm(t('adminDashboard.userManagement.deleteUser') + '?')) return;

        // Remove the employee from the state
        setEmployees(employees.filter((employee) => employee._id !== id));

        // Show notification
        setNotification({
            show: true,
            type: 'success',
            message: t('adminDashboard.notifications.employeeDeleted'),
        });
    };

    // Create a simple form without using custom components to avoid blank page issues
    const renderAddForm = () => {
        return (
            <div className="form-container" style={{ marginBottom: '20px' }}>
                <h3>{t('adminDashboard.userManagement.addNewEmployee')}</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="form-content">
                    <div className="input-group">
                        <label>{t('adminDashboard.userManagement.fullName')} *</label>
                        <input
                            type="text"
                            className="form-textarea"
                            placeholder={t('adminDashboard.userManagement.fullName')}
                            {...register('name', { required: true })}
                        />
                    </div>

                    <div className="input-group">
                        <label>{t('adminDashboard.userManagement.email')} *</label>
                        <input
                            type="email"
                            className="form-textarea"
                            placeholder={t('adminDashboard.userManagement.email')}
                            {...register('email', { required: true })}
                        />
                    </div>

                    <div className="input-group">
                        <label>{t('adminDashboard.userManagement.password')} *</label>
                        <input
                            type="password"
                            className="form-textarea"
                            placeholder={t('adminDashboard.userManagement.password')}
                            {...register('password', { required: true })}
                        />
                    </div>

                    <div className="input-group">
                        <label>{t('adminDashboard.userManagement.role')}:</label>
                        <select {...register('role', { required: true })} className="form-textarea">
                            <option value="professor">{t('adminDashboard.userManagement.professor')}</option>
                            <option value="assistant">{t('adminDashboard.userManagement.assistant')}</option>
                            <option value="secretary">{t('adminDashboard.userManagement.secretary')}</option>
                            <option value="admin">{t('adminDashboard.userManagement.admin')}</option>
                        </select>
                    </div>

                    <div className="button-group">
                        <button type="submit" className="action-button approve-button">
                            {t('adminDashboard.userManagement.addEmployee')}
                        </button>
                        <button type="button" className="action-button" onClick={() => setShowAddForm(false)}>
                            {t('adminDashboard.userManagement.cancel')}
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    return (
        <div>
            <h2 className="form-title">{t('adminDashboard.userManagement.employeeManagement')}</h2>

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
                    <h3>{t('adminDashboard.userManagement.employees')}</h3>
                    <button className="action-button approve-button" onClick={() => setShowAddForm(!showAddForm)}>
                        {showAddForm
                            ? t('adminDashboard.userManagement.cancel')
                            : t('adminDashboard.userManagement.addNewEmployee')}
                    </button>
                </div>

                {showAddForm && renderAddForm()}

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{t('adminDashboard.userManagement.name')}</th>
                            <th>{t('adminDashboard.userManagement.email')}</th>
                            <th>{t('adminDashboard.userManagement.role')}</th>
                            <th>{t('adminDashboard.userManagement.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee._id}>
                                <td>{employee.name}</td>
                                <td>{employee.email}</td>
                                <td>{t(`adminDashboard.userManagement.${employee.role}`)}</td>
                                <td>
                                    <button
                                        className="action-button reject-button"
                                        onClick={() => handleDelete(employee._id)}
                                    >
                                        {t('adminDashboard.userManagement.delete')}
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
