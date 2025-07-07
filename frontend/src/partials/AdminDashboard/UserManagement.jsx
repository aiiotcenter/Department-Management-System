import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Input from '../../components/Input';
import useUsers from '../../hooks/useUsers';
import { addUser, updateUser } from '../../services/userService';
import './UserManagement.css';

export default function UserManagement() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const { t } = useTranslation();

    // Use the custom hook for user management
    const { users, loading, error, fetchUsers, removeUser } = useUsers();

    // Edit state
    const [editUserId, setEditUserId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });

    // Fetch users from the backend when component mounts
    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Function to add a new user
    const onSubmit = async (data) => {
        try {
            // Send data to backend
            const userData = {
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role,
            };

            await addUser(userData);

            // Clear form first
            reset();
            setShowAddForm(false);

            // Add a slight delay before refreshing the list to ensure the database has updated
            setTimeout(async () => {
                await fetchUsers();

                // Show notification
                setNotification({
                    show: true,
                    type: 'success',
                    message: t('adminDashboard.notifications.userAdded'),
                });
            }, 500);
        } catch (err) {
            console.error('Error adding user:', err);
            setNotification({
                show: true,
                type: 'error',
                message: err.message || t('adminDashboard.notifications.errorAddingUser'),
            });
        }
    };

    // Function to delete a user
    const handleDelete = async (id) => {
        const confirmMessage = `${t('adminDashboard.userManagement.deleteUser')}?\n\n${t('adminDashboard.userManagement.deleteWarning')}\n${t('adminDashboard.userManagement.deleteItems')}\n\n${t('adminDashboard.userManagement.deleteConfirm')}`;

        if (!window.confirm(confirmMessage)) return;

        try {
            // Call the removeUser function from the hook which will handle deletion and refresh all user lists
            const result = await removeUser(id);

            if (result.success) {
                // Show success notification
                setNotification({
                    show: true,
                    type: 'success',
                    message: t('adminDashboard.notifications.userDeleted'),
                });
            } else {
                throw new Error(result.error);
            }
        } catch (err) {
            console.error('Error deleting user:', err);

            // Show more specific error message
            let errorMessage = err.message || t('adminDashboard.notifications.errorDeletingUser');

            setNotification({
                show: true,
                type: 'error',
                message: errorMessage,
            });
        }

        // Hide notification after 5 seconds
        setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
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
    const handleEditSave = async (id) => {
        try {
            // Call backend to update user
            await updateUser(id, editForm);

            // Clear edit state
            setEditUserId(null);

            // Refresh the entire user list to ensure we have the latest data
            await fetchUsers();

            // Show notification
            setNotification({
                show: true,
                type: 'success',
                message: t('adminDashboard.notifications.userUpdated') || 'User updated successfully',
            });
        } catch (err) {
            console.error('Error updating user:', err);
            setNotification({
                show: true,
                type: 'error',
                message: err.message || t('adminDashboard.notifications.errorUpdatingUser'),
            });
        }
    };

    // Cancel editing
    const handleEditCancel = () => {
        setEditUserId(null);
    };

    // Create a form for adding new users
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
                            rules={{ required: true }}
                        />
                        {errors.name && <span className="error-text">{t('common.errors.required')}</span>}
                    </div>

                    <div className="input-group">
                        <Input
                            type="email"
                            placeholder={t('adminDashboard.userManagement.email') + ' *'}
                            register={register}
                            name="email"
                            rules={{ required: true, pattern: /^\S+@\S+$/i }}
                        />
                        {errors.email && errors.email.type === 'required' && (
                            <span className="error-text">{t('common.errors.required')}</span>
                        )}
                        {errors.email && errors.email.type === 'pattern' && (
                            <span className="error-text">{t('common.errors.invalidEmail')}</span>
                        )}
                    </div>

                    <div className="input-group">
                        <Input
                            type="password"
                            placeholder={t('adminDashboard.userManagement.password') + ' *'}
                            register={register}
                            name="password"
                            rules={{ required: true, minLength: 6 }}
                        />
                        {errors.password && errors.password.type === 'required' && (
                            <span className="error-text">{t('common.errors.required')}</span>
                        )}
                        {errors.password && errors.password.type === 'minLength' && (
                            <span className="error-text">{t('common.errors.passwordLength')}</span>
                        )}
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
                        {errors.role && <span className="error-text">{t('common.errors.required')}</span>}
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

            {/* Refresh Button */}
            <div className="section-header">
                <button onClick={fetchUsers} className="refresh-button" disabled={loading}>
                    {loading ? t('common.loading') : t('common.refresh')}
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="error-container">
                    <p className="error-message">{error}</p>
                </div>
            )}

            {/* Loading Message */}
            {loading ? (
                <div className="loading-container">
                    <p>{t('common.loading')}</p>
                </div>
            ) : (
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

                    {users.length > 0 ? (
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
                    ) : (
                        <div className="no-data-message">
                            <p>{t('adminDashboard.userManagement.noUsers')}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
