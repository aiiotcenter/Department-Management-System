import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useUsers from '../../hooks/useUsers';
import { fetchInternships, updateInternshipTitle } from '../../services/internship';

import './AdminInternships.css';

export default function AdminInternships() {
    const { t } = useTranslation();
    const [internships, setInternships] = useState([]);
    const [selected, setSelected] = useState({});
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });
    const [editingInternship, setEditingInternship] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editForm, setEditForm] = useState({ title: '', staffId: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [students, setStudents] = useState([]);

    // Initialize team assignments from localStorage or empty object
    const [teamAssignments, setTeamAssignments] = useState(() => {
        try {
            const saved = localStorage.getItem('internship-team-assignments');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error('Error loading team assignments from localStorage:', error);
            return {};
        }
    });

    // Use the shared user hook to get staff data that's always up to date
    const { staffUsers, fetchStaff, refreshAllUsers } = useUsers();

    // Save team assignments to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('internship-team-assignments', JSON.stringify(teamAssignments));
        } catch (error) {
            console.error('Error saving team assignments to localStorage:', error);
        }
    }, [teamAssignments]);

    // Clean up assignments for staff members who no longer exist
    useEffect(() => {
        if (staffUsers.length > 0 && Object.keys(teamAssignments).length > 0) {
            const currentStaffIds = new Set(staffUsers.map((staff) => staff.id));
            const assignmentStaffIds = Object.keys(teamAssignments);

            const hasDeletedStaff = assignmentStaffIds.some((staffId) => !currentStaffIds.has(staffId));

            if (hasDeletedStaff) {
                const cleanedAssignments = {};
                assignmentStaffIds.forEach((staffId) => {
                    if (currentStaffIds.has(staffId)) {
                        cleanedAssignments[staffId] = teamAssignments[staffId];
                    }
                });
                setTeamAssignments(cleanedAssignments);
            }
        }
    }, [staffUsers, teamAssignments]);

    // Combine staff users with team assignments
    const staffTeams = staffUsers.map((staff) => ({
        ...staff,
        team: teamAssignments[staff.id] || [],
    }));

    // Define fetchData with useCallback to prevent recreating the function on every render
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch internships from the backend
            const internshipsData = await fetchInternships();
            console.log('Fetched internship data:', internshipsData);

            // Handle the case where the API returns a message instead of an array
            if (Array.isArray(internshipsData)) {
                setInternships(internshipsData);

                // Extract student data from internship applications
                const extractedStudents = new Map();
                internshipsData.forEach((internship) => {
                    console.log('Processing internship:', internship);
                    if (!extractedStudents.has(internship.User_ID)) {
                        extractedStudents.set(internship.User_ID, {
                            id: internship.User_ID,
                            name: internship.User_name,
                        });
                    }
                });
                setStudents(Array.from(extractedStudents.values()));
            } else if (internshipsData.message) {
                // If the API returns a message like "No internship applications found"
                console.log('API message:', internshipsData.message);
                setInternships([]);
                setStudents([]);
            }

            // Fetch staff users using the shared hook
            await fetchStaff();
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(t('adminDashboard.internshipAssignments.error'));
        } finally {
            setLoading(false);
        }
    }, [t, fetchStaff]);

    // Fetch internships and staff data on component mount
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Refresh data when coming back to this component (e.g., after user deletion)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                refreshAllUsers();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [refreshAllUsers]);

    // Utility function to check if an internship is approved (handles case sensitivity)
    const isApproved = (internship) => {
        if (!internship || !internship.status) return false;
        const status = internship.status.toLowerCase();
        return status === 'approved';
    };

    // Filter to only show approved internships
    const approvedInternships = internships.filter(isApproved).map((internship) => ({
        id: internship._id || internship.User_ID,
        title: internship.department || 'Unnamed Internship',
        duration: internship.period_of_internship || '',
        description: internship.additional_notes || '',
        approvedStudents: [internship.User_ID], // Array of student IDs who applied
        status: internship.status,
        university: internship.university || '',
    }));

    const handleAssign = (internshipId, staffId) => {
        const studentIds = selected[internshipId]?.students || [];
        const staffMember = staffTeams.find((s) => s.id === staffId);

        // Update team assignments
        setTeamAssignments((prev) => ({
            ...prev,
            [staffId]: [...(prev[staffId] || []), ...studentIds.filter((id) => !(prev[staffId] || []).includes(id))],
        }));

        setSelected((sel) => ({ ...sel, [internshipId]: { students: [], staff: staffId } }));

        // Show notification
        setNotification({
            show: true,
            type: 'success',
            message: t('adminDashboard.internshipAssignments.assignmentSuccess', {
                count: studentIds.length,
                staffName: staffMember?.name,
            }),
        });

        // Hide notification after 3 seconds
        setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
    };

    const openEditModal = (internship) => {
        setEditingInternship(internship);
        setEditForm({
            title: internship.title,
            staffId: selected[internship.id]?.staff || '',
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingInternship(null);
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm({
            ...editForm,
            [name]: name === 'staffId' ? value : value,
        });
    };

    const handleSaveInternship = async () => {
        if (!editForm.title.trim()) {
            setNotification({
                show: true,
                type: 'error',
                message: t('adminDashboard.internshipAssignments.titleRequired'),
            });
            return;
        }

        try {
            // Update internship title (this would need a backend API)
            await updateInternshipTitle({
                id: editingInternship.id,
                title: editForm.title,
            });

            // Update local state
            setInternships((prevInternships) =>
                prevInternships.map((internship) =>
                    internship._id === editingInternship.id || internship.User_ID === editingInternship.id
                        ? { ...internship, department: editForm.title }
                        : internship
                )
            );

            // Assign to staff if a staff member is selected
            if (editForm.staffId) {
                const studentIds = editingInternship.approvedStudents;

                // Update team assignments
                setTeamAssignments((prev) => ({
                    ...prev,
                    [editForm.staffId]: [
                        ...(prev[editForm.staffId] || []),
                        ...studentIds.filter((id) => !(prev[editForm.staffId] || []).includes(id)),
                    ],
                }));

                const staffMember = staffTeams.find((s) => s.id === editForm.staffId);
                setNotification({
                    show: true,
                    type: 'success',
                    message: t('adminDashboard.internshipAssignments.updateSuccess', {
                        title: editForm.title,
                        staffName: staffMember?.name,
                    }),
                });
            } else {
                setNotification({
                    show: true,
                    type: 'success',
                    message: t('adminDashboard.internshipAssignments.titleUpdateSuccess', {
                        title: editForm.title,
                    }),
                });
            }

            // Close modal and clear form
            closeModal();
        } catch (err) {
            console.error('Error updating internship:', err);
            setNotification({
                show: true,
                type: 'error',
                message: 'Failed to update internship: ' + err.message,
            });
        }

        setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
    };

    if (loading) {
        return (
            <div className="internship-management-container">
                <div className="loading-container">
                    <h2 className="form-title">{t('adminDashboard.internshipAssignments.title')}</h2>
                    <p>{t('adminDashboard.internshipAssignments.loading')}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="internship-management-container">
                <div className="error-container">
                    <h2 className="form-title">{t('adminDashboard.internshipAssignments.title')}</h2>
                    <p className="error-message">{error}</p>
                    <button className="refresh-button" onClick={fetchData}>
                        {t('adminDashboard.internshipAssignments.refresh')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="internship-management-container">
            <h2 className="form-title">{t('adminDashboard.internshipAssignments.title')}</h2>

            {notification.show && <div className={`notification ${notification.type}`}>{notification.message}</div>}

            <div className="admin-panel">
                <div className="section-header">
                    <h3>{t('adminDashboard.internshipAssignments.approvedInternships')}</h3>
                    <button className="refresh-button" onClick={fetchData}>
                        {t('adminDashboard.internshipAssignments.refresh')}
                    </button>
                </div>

                {approvedInternships.length === 0 ? (
                    <p>{t('adminDashboard.internshipAssignments.noApprovedInternships')}</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>{t('adminDashboard.internshipAssignments.internshipTitle')}</th>
                                <th>{t('adminDashboard.internshipAssignments.duration')}</th>
                                <th>{t('adminDashboard.internshipAssignments.approvedStudents')}</th>
                                <th>{t('adminDashboard.internshipAssignments.staffAssignment')}</th>
                                <th>{t('adminDashboard.internshipAssignments.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {approvedInternships.map((internship) => (
                                <tr key={internship.id} className="internship-row">
                                    <td onClick={() => openEditModal(internship)} className="clickable-cell">
                                        <strong>{internship.title}</strong>
                                        <span className="edit-hint">
                                            {t('adminDashboard.internshipAssignments.clickToEdit')}
                                        </span>
                                    </td>
                                    <td>{internship.duration}</td>
                                    <td>
                                        <div className="student-selection">
                                            {internship.approvedStudents.map((sid) => (
                                                <label key={sid} className="student-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            selected[internship.id]?.students?.includes(sid) || false
                                                        }
                                                        onChange={(e) => {
                                                            setSelected((sel) => {
                                                                const prev = sel[internship.id]?.students || [];
                                                                return {
                                                                    ...sel,
                                                                    [internship.id]: {
                                                                        ...sel[internship.id],
                                                                        students: e.target.checked
                                                                            ? [...prev, sid]
                                                                            : prev.filter((id) => id !== sid),
                                                                        staff: sel[internship.id]?.staff || '',
                                                                    },
                                                                };
                                                            });
                                                        }}
                                                    />
                                                    {students.find((s) => s.id === sid)?.name}
                                                </label>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <select
                                            className="input-select"
                                            value={selected[internship.id]?.staff || ''}
                                            onChange={(e) =>
                                                setSelected((sel) => ({
                                                    ...sel,
                                                    [internship.id]: {
                                                        ...sel[internship.id],
                                                        staff: e.target.value,
                                                    },
                                                }))
                                            }
                                        >
                                            <option value="">
                                                {t('adminDashboard.internshipAssignments.selectStaff')}
                                            </option>
                                            {staffTeams.map((st) => (
                                                <option key={st.id} value={st.id}>
                                                    {st.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="form-button form-button-sm form-button-compact assign-button"
                                                disabled={
                                                    !selected[internship.id]?.staff ||
                                                    !selected[internship.id]?.students?.length
                                                }
                                                onClick={() =>
                                                    handleAssign(internship.id, selected[internship.id].staff)
                                                }
                                            >
                                                {t('adminDashboard.internshipAssignments.assign')}
                                            </button>
                                            <button
                                                className="form-button form-button-sm form-button-compact edit-button"
                                                onClick={() => openEditModal(internship)}
                                            >
                                                {t('adminDashboard.actions.edit')}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="admin-panel">
                <div className="section-header">
                    <h3>{t('adminDashboard.internshipAssignments.staffTeams')}</h3>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{t('adminDashboard.internshipAssignments.staffMember')}</th>
                            <th>{t('adminDashboard.internshipAssignments.teamMembers')}</th>
                            <th>{t('adminDashboard.internshipAssignments.teamSize')}</th>
                            <th>{t('adminDashboard.internshipAssignments.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staffTeams.map((st) => (
                            <tr key={st.id}>
                                <td>
                                    <strong>{st.name}</strong>
                                </td>
                                <td>
                                    <div className="team-members">
                                        {st.team.length === 0 ? (
                                            <span className="no-members">
                                                {t('adminDashboard.internshipAssignments.noStudentsAssigned')}
                                            </span>
                                        ) : (
                                            st.team.map((sid) => (
                                                <span key={sid} className="team-member-badge">
                                                    {students.find((s) => s.id === sid)?.name}
                                                </span>
                                            ))
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <span className="team-size-badge">
                                        {st.team.length}{' '}
                                        {st.team.length !== 1
                                            ? t('adminDashboard.internshipAssignments.students')
                                            : t('adminDashboard.internshipAssignments.student')}
                                    </span>
                                </td>
                                <td>
                                    {st.team.length > 0 && (
                                        <button
                                            className="form-button form-button-sm form-button-compact"
                                            onClick={() => {
                                                setTeamAssignments((prev) => ({
                                                    ...prev,
                                                    [st.id]: [],
                                                }));
                                                setNotification({
                                                    show: true,
                                                    type: 'success',
                                                    message: t('adminDashboard.internshipAssignments.teamCleared', {
                                                        staffName: st.name,
                                                    }),
                                                });
                                                setTimeout(
                                                    () => setNotification({ show: false, type: '', message: '' }),
                                                    3000
                                                );
                                            }}
                                        >
                                            {t('adminDashboard.internshipAssignments.clearTeam')}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Internship Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>{t('adminDashboard.internshipAssignments.editInternship')}</h3>
                            <button className="close-button" onClick={closeModal}>
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="title">
                                    {t('adminDashboard.internshipAssignments.internshipTitle')}
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={editForm.title}
                                    onChange={handleEditFormChange}
                                    className="form-input"
                                    placeholder={t('adminDashboard.internshipAssignments.enterTitle')}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="staffId">
                                    {t('adminDashboard.internshipAssignments.assignToStaff')}
                                </label>
                                <select
                                    id="staffId"
                                    name="staffId"
                                    value={editForm.staffId}
                                    onChange={handleEditFormChange}
                                    className="form-input"
                                >
                                    <option value="">{t('adminDashboard.internshipAssignments.selectStaff')}</option>
                                    {staffTeams.map((st) => (
                                        <option key={st.id} value={st.id}>
                                            {st.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="student-list">
                                <label>{t('adminDashboard.internshipAssignments.studentsToBeAssigned')}</label>
                                <div className="team-members">
                                    {editingInternship?.approvedStudents.map((sid) => (
                                        <span key={sid} className="team-member-badge">
                                            {students.find((s) => s.id === sid)?.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="form-button cancel-button" onClick={closeModal}>
                                {t('adminDashboard.internshipAssignments.cancel')}
                            </button>
                            <button className="form-button save-button" onClick={handleSaveInternship}>
                                {t('adminDashboard.internshipAssignments.save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
