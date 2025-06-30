import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Input from '../../components/Input';
import './UserManagement.css';

export default function UserManagement() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });
    const { register, handleSubmit, reset } = useForm(); // removed setValue
    const { t } = useTranslation();

    // Mock data with state that can be modified
    const [users, setUsers] = useState([
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

    // Edit state
    const [editUserId, setEditUserId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });

    // Function to add a new user
    const onSubmit = (data) => {
        // Create a new user with the form data
        const newUser = {
            _id: (users.length + 1).toString(), // Simple ID generation
            name: data.name,
            email: data.email,
            role: data.role,
        };

        // Add the new user to the state
        setUsers([...users, newUser]);

        // Show notification
        setNotification({
            show: true,
            type: 'success',
            message: t('adminDashboard.notifications.userAdded'),
        });

        // Close the form and reset fields
        setShowAddForm(false);
        reset();
    };

    // Function to delete a user
    const handleDelete = (id) => {
        if (!window.confirm(t('adminDashboard.userManagement.deleteUser') + '?')) return;

        // Remove the user from the state
        setUsers(users.filter((user) => user._id !== id));

        // Show notification
        setNotification({
            show: true,
            type: 'success',
            message: t('adminDashboard.notifications.userDeleted'),
        });
    };

    // Start editing a user
    const handleEdit = (user) => {
        setEditUserId(user._id);
        setEditForm({ name: user.name, email: user.email, role: user.role });
    };

    // Handle edit form changes
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    // Save edited user
    const handleEditSave = (id) => {
        setUsers((prev) => prev.map((user) => (user._id === id ? { ...user, ...editForm } : user)));
        setNotification({
            show: true,
            type: 'success',
            message: t('adminDashboard.notifications.userUpdated') || 'User updated successfully',
        });
        setEditUserId(null);
    };

    // Cancel editing
    const handleEditCancel = () => {
        setEditUserId(null);
    };

    // Create a simple form without using custom components to avoid blank page issues
    const renderAddForm = () => {
        return (
            <div className="form-container user-management-form" style={{ marginBottom: '20px' }}>
                <h3 style={{ textAlign: 'center' }}>{t('adminDashboard.userManagement.addNewUser')}</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="form-content">
                    <div className="input-group">
                        <Input
                            type="text"
                            placeholder={t('adminDashboard.userManagement.fullName') + ' *'}
                            register={register}
                            name="name"
                        />
                    </div>

                    <div className="input-group">
                        <Input
                            type="email"
                            placeholder={t('adminDashboard.userManagement.email') + ' *'}
                            register={register}
                            name="email"
                        />
                    </div>

                    <div className="input-group">
                        <Input
                            type="password"
                            placeholder={t('adminDashboard.userManagement.password') + ' *'}
                            register={register}
                            name="password"
                        />
                    </div>

                    <div className="input-group">
                        <select {...register('role', { required: true })} className="input-select">
                            <option value="" disabled selected>
                                {t('adminDashboard.userManagement.role')}...
                            </option>
                            <option value="professor">{t('adminDashboard.userManagement.professor')}</option>
                            <option value="assistant">{t('adminDashboard.userManagement.assistant')}</option>
                            <option value="secretary">{t('adminDashboard.userManagement.secretary')}</option>
                            <option value="admin">{t('adminDashboard.userManagement.admin')}</option>
                            <option value="student">{t('adminDashboard.userManagement.student')}</option>
                        </select>
                    </div>

                    <div className="form-buttons-centered">
                        <button type="submit" className="form-button form-button-action">
                            {t('adminDashboard.userManagement.addUser')}
                        </button>
                        <button
                            type="button"
                            className="form-button form-button-action"
                            onClick={() => setShowAddForm(false)}
                        >
                            {t('adminDashboard.userManagement.cancel')}
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    return (
        <div>
            <h2 className="form-title">{t('adminDashboard.userManagement.userManagement')}</h2>

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
                    <h3>{t('adminDashboard.userManagement.users')}</h3>
                    <button
                        className="form-button form-button-sm form-button-action"
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        {showAddForm
                            ? t('adminDashboard.userManagement.cancel')
                            : t('adminDashboard.userManagement.addNewUser')}
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
                        {users.map((user) => (
                            <tr key={user._id}>
                                {editUserId === user._id ? (
                                    <>
                                        <td>
                                            <input
                                                type="text"
                                                name="name"
                                                value={editForm.name}
                                                onChange={handleEditChange}
                                                className="form-input"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="email"
                                                name="email"
                                                value={editForm.email}
                                                onChange={handleEditChange}
                                                className="form-input"
                                            />
                                        </td>
                                        <td>
                                            <select
                                                name="role"
                                                value={editForm.role}
                                                onChange={handleEditChange}
                                                className="input-select"
                                            >
                                                <option value="professor">
                                                    {t('adminDashboard.userManagement.professor')}
                                                </option>
                                                <option value="assistant">
                                                    {t('adminDashboard.userManagement.assistant')}
                                                </option>
                                                <option value="secretary">
                                                    {t('adminDashboard.userManagement.secretary')}
                                                </option>
                                                <option value="admin">
                                                    {t('adminDashboard.userManagement.admin')}
                                                </option>
                                                <option value="student">
                                                    {t('adminDashboard.userManagement.student')}
                                                </option>
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                className="form-button form-button-sm form-button-compact"
                                                onClick={() => handleEditSave(user._id)}
                                            >
                                                {t('adminDashboard.userManagement.save') || 'Save'}
                                            </button>
                                            <button
                                                className="form-button form-button-sm form-button-compact"
                                                onClick={handleEditCancel}
                                            >
                                                {t('adminDashboard.userManagement.cancel') || 'Cancel'}
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{t(`adminDashboard.userManagement.${user.role}`)}</td>
                                        <td>
                                            <button
                                                className="form-button form-button-sm form-button-compact"
                                                onClick={() => handleEdit(user)}
                                            >
                                                {t('adminDashboard.userManagement.edit') || 'Edit'}
                                            </button>
                                            <button
                                                className="form-button form-button-sm form-button-compact"
                                                onClick={() => handleDelete(user._id)}
                                            >
                                                {t('adminDashboard.userManagement.delete')}
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
